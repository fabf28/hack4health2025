import os
from dotenv import load_dotenv
from langchain_community.document_loaders import JSONLoader
#from langchain.vectorstores import FAISS
from sentence_transformers import SentenceTransformer
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

chroma_directory = "db/chroma_index"

def load_operation_hours():
    # Load the JSON File as Documents
    file_path = "data/operation_hours.json"
    loader = JSONLoader(file_path=file_path, jq_schema=".WaitTimes | .. | objects | select(.name != null)", text_content=False)
    documents = loader.load()
    return documents

def load_waittimes():
    # Load the JSON File as Documents
    file_path = "data/waittimes.json"
    loader = JSONLoader(file_path=file_path, jq_schema=".[] | .Emergency[], .Urgent[]", text_content=False)
    documents = loader.load()
    return documents


def create_chroma_db(documents):
    model_name = "all-MiniLM-L6-v2"  # Lightweight and free
    embeddings = HuggingFaceEmbeddings(model_name=model_name)
    chroma_db = Chroma.from_documents(documents, embeddings, persist_directory=chroma_directory)


documents = load_waittimes()
create_chroma_db(documents)