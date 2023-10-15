import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline, TextStreamer
from langchain.vectorstores.chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader, PyPDFLoader, DirectoryLoader
# from InstructorEmbedding import INSTRUCTOR
from langchain.embeddings import HuggingFaceInstructEmbeddings
from langchain.llms.huggingface_pipeline import HuggingFacePipeline
import os
from InstructorEmbedding import INSTRUCTOR
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.callbacks.base import BaseCallbackHandler
from langchain.callbacks.streaming_aiter import AsyncIteratorCallbackHandler
import time
from auto_gptq import exllama_set_max_input_length

device = "cuda" if torch.cuda.is_available() else "cpu"
model_name_or_path = "TheBloke/Mistral-7B-OpenOrca-GPTQ"
revision = "gptq-4bit-32g-actorder_True"


class Mistral7B:
    def __init__(self):
        model = AutoModelForCausalLM.from_pretrained(model_name_or_path,
                                                     device_map="auto",
                                                     trust_remote_code=False,
                                                     revision=revision)
        model = exllama_set_max_input_length(model, 4096)
        tokenizer = AutoTokenizer.from_pretrained(
            model_name_or_path, use_fast=True)
        streamer = TextStreamer(tokenizer, skip_prompt=True)
        pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            max_new_tokens=4096,
            do_sample=True,
            temperature=0.1,
            top_p=0.95,
            top_k=40,
            repetition_penalty=1.1,
            streamer=streamer,
        )
        self.local_llm = HuggingFacePipeline(
            pipeline=pipe, callbacks=[StreamingStdOutCallbackHandler()])
        self.documents = []

    async def loadPDF(self):
        loader = DirectoryLoader(
            './data/', glob="./*.pdf", loader_cls=PyPDFLoader)
        if self.documents is None:
            self.documents = []
        self.documents = self.documents + loader.load()
        print(len(self.documents))

    async def loadText(self):
        loader = DirectoryLoader(
            './data/', glob="./*.txt", loader_cls=TextLoader)
        if self.documents is None:
            self.documents = []
        self.documents = self.documents + loader.load()
        # self.documents = self.documents.extend(await loader.load())
        print(len(self.documents))

    async def embedding(self):
        # splitting the text into
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000, chunk_overlap=200)
        texts = text_splitter.split_documents(self.documents)

        instructor_embeddings = HuggingFaceInstructEmbeddings(model_name="hkunlp/instructor-xl",
                                                              model_kwargs={"device": device})
        # Embed and store the texts
        # Supplying a persist_directory will store the embeddings on disk
        persist_directory = 'db'

        # Here is the nmew embeddings being used
        embedding = instructor_embeddings

        self.vectordb = Chroma.from_documents(documents=texts,
                                              embedding=embedding,
                                              persist_directory=persist_directory)

    async def createQAChain(self):
        retriever = self.vectordb.as_retriever(search_kwargs={"k": 3})
        self.qa_chain = RetrievalQA.from_chain_type(llm=self.local_llm,
                                                    chain_type="stuff",
                                                    retriever=retriever,
                                                    return_source_documents=True,)

    def process_response(self, query: str):
        print("start Responding...")
        for stre in self.qa_chain.stream(query):
            if ("result" in stre):
                yield stre["result"]

            if ("source_documents" in stre):
                line = ""
                line += '\n\nSources:'
                for source in stre["source_documents"]:
                    if ('page' in source.metadata):
                        line += f"Page {source.metadata['page']}, "
                    line += f"{source.metadata['source']}\n"
                yield line

            print(stre)
