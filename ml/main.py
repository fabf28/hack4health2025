import argparse
import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
#from langchain_google_genai import ChatGoogleGenerativeAI  # Gemini model
from google import genai
from google.genai import types
from fastapi import FastAPI

#initialize app
app = FastAPI()

# Load environment variables
load_dotenv()

CHROMA_PATH = "db/chroma_index"

@app.post("/")
def main(data, quesiton):
    # Command-line argument for query
    
    data = str(data)
    query_text = "Based on the users data, give a reccomendation on which emergency centre to go to and its wait time. Give some tips on how to tend to the injory or situation at home."

    # Load embeddings and Chroma DB
    model_name = "all-MiniLM-L6-v2"  # Lightweight & free
    embedding_function = HuggingFaceEmbeddings(model_name=model_name)
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Perform similarity search
    results = db.similarity_search_with_relevance_scores(query_text, k=3)

    # Combine top results as context
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])

    #print("context text: ", context_text)


    client = genai.Client()

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
        system_instruction=f"Take into consideration the following context: {context_text}. The users data is {data}. You are a chat bot for an application that gives direct reccomendations on what individuals should and where they should go in case of the medical emergency situation that they are in. Use info from https://www.albertahealthservices.ca/waittimes/Page14230.aspx. Give a waiting time for the reccomended hospital. "),
        contents=query_text
    )
    print(response.text)

    return {"message": response.text}


