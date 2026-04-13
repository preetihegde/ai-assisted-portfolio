from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

def retrieve_vector_data(db_path):
    embeddings = HuggingFaceEmbeddings() #model_kwargs={"device":"cuda"}
    vector_retrival = Chroma(
        persist_directory=db_path,
        embedding_function=embeddings
    )
    return vector_retrival