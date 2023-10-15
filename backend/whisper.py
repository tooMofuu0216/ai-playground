from faster_whisper import WhisperModel
import torch

model_size = "tiny"
device = "cuda" if torch.cuda.is_available() else "cpu"

# my_class.py

class Whisper:
    def __init__(self):
        if(device == "cuda"):
            self.model = WhisperModel(model_size, device=device, compute_type="float16")
        else:
            self.model = WhisperModel(model_size, device=device, compute_type="int8")

    def transcribe(self, filePath):
        print("Start Transcribe....")
        segments, info = self.model.transcribe(filePath)
        print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
        return segments
    
    def format_time(self, seconds):
        hours, remainder = divmod(seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}"
    
    def writeAndGenerateTrascribe(self, segments, txtWrittenPath):
        with open(txtWrittenPath, "wb") as f:
            for segment in segments:
                formatted_start = self.format_time(segment.start)
                formatted_end = self.format_time(segment.end)
                line = "[%s -> %s] %s\n" % (formatted_start, formatted_end, segment.text)
                byteLine = line.encode("utf-8")
                f.write(byteLine)
                yield byteLine

