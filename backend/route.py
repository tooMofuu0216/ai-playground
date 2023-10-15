import io
import os
import sys
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware import Middleware
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
from pytube import YouTube
from whisper import Whisper
from Mistral7bModel import Mistral7B
import time

# upload file settings
vdo_dir = "video"
uploadDocDir = "data"
if not os.path.exists(vdo_dir):
    os.makedirs(vdo_dir)
elif not os.path.exists(uploadDocDir):
    os.makedirs(uploadDocDir)

default_file_name = "test"
video_path = os.path.join(vdo_dir, f"{default_file_name}.mp4")
transcriptFileNm = "transcribe.txt"
txtWrittenPath = os.path.join(vdo_dir, f"{transcriptFileNm}")

# load model
whisperModel = Whisper()
m7b = Mistral7B()

# api setting
app = FastAPI()
# Maximum file size allowed (in bytes)
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

def check_file_size(request: Request):
    content_length = request.headers.get("content-length")
    if content_length:
        file_size = int(content_length)
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413, detail="File size exceeds the limit")
    return None


def error_handling_middleware(request: Request, call_next):
    try:
        response = call_next(request)
        return response
    except HTTPException as http_exception:
        return http_exception


middlewares = [
    Middleware(check_file_size),
    Middleware(error_handling_middleware),
    Middleware(TrustedHostMiddleware, allowed_hosts=["*"]),
]

@app.post("/uploadDoc")
async def upload_Doc(files: list[UploadFile]):
    # Check if the file was provided
    if files is None:
        raise HTTPException(status_code=400, detail="No file provided")

    for file in files:
        fileData = await file.read()
        path = os.path.join(uploadDocDir, file.filename)
        with open(path, "wb") as f:
            f.write(fileData)

    await m7b.loadPDF()
    await m7b.loadText()
    await m7b.embedding()
    await m7b.createQAChain()
    return JSONResponse(content={"message": "File uploaded successfully"})


@app.post("/docQA")
async def docQA(query: str = Form(...)):
    # Check if the file was provided
    if query is None:
        raise HTTPException(status_code=400, detail="No query provided")
    # what are the ways to use numpy
    return StreamingResponse(m7b.process_response(query), media_type="text/plain")


@app.post("/uploadVideo")
async def upload_video(file: UploadFile):
    # Check if the file was provided
    if file is None:
        raise HTTPException(status_code=400, detail="No file provided")

    segments = whisperModel.transcribe(file.file)
    return StreamingResponse(whisperModel.writeAndGenerateTrascribe(segments, txtWrittenPath), media_type="text/plain")


@app.post("/download_youtube_video")
async def download_youtube_video(youtube_link: str = Form(...)):
    # Validate the YouTube URL
    yt = YouTube(youtube_link)
    stream = yt.streams.get_highest_resolution()

    # Download the video and save it to the directory
    stream.download(output_path=vdo_dir, filename=f"{default_file_name}.mp4")
    segments = whisperModel.transcribe(video_path)
    return StreamingResponse(whisperModel.writeAndGenerateTrascribe(segments, txtWrittenPath), media_type="text/plain")


@app.get("/downloadTranscript")
async def download_file():
    return FileResponse(txtWrittenPath, headers={"Content-Disposition": f"attachment; filename={transcriptFileNm}"})

uvicorn.run(app, host="0.0.0.0", port=8000)
