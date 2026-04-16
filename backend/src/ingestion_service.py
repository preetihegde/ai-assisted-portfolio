import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, UnstructuredFileLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from src.utility_service import get_file_paths

load_dotenv()


def vectorize_cv():
    """Load, split and embed all PDF/TXT files in the data directory."""
    # ✅ All path resolution happens INSIDE the function — safe at import time
    file_paths = get_file_paths()
    data_dir = file_paths["data_dir"]
    vector_db_path = file_paths["vector_db_path"]

    # ✅ Embeddings initialised inside function, not at module level
    embedding = HuggingFaceEmbeddings()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=100)

    all_docs = []
    for resume_data in os.listdir(data_dir):
        if not resume_data.endswith((".pdf", ".txt")):
            continue

        each_file_path = os.path.join(data_dir, resume_data)

        try:
            loader = PyPDFLoader(each_file_path)
            documents = loader.load()
        except Exception as e:
            print(f"PyPDF failed for {resume_data}, using Unstructured. Error: {e}")
            loader = UnstructuredFileLoader(each_file_path)
            documents = loader.load()

        texts = text_splitter.split_documents(documents)

        for doc in texts:
            doc.metadata["source"] = resume_data
        all_docs.extend(texts)

    vectordb = Chroma.from_documents(
        documents=all_docs,
        embedding=embedding,
        persist_directory=vector_db_path,
    )

    print(f"✅ All CVs stored in vector DB at: {vector_db_path}")
    return vectordb
