import os
from dotenv import load_dotenv
from langchain_community.document_loaders import UnstructuredFileLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from backend.src.utility_service import get_file_paths
from langchain_chroma import Chroma

# ✅ Load environment variables
load_dotenv()

file_paths= get_file_paths()
data_dir = file_paths['data_dir']
vector_db_path = file_paths['vector_db_path']

# ✅ Embedding + splitter
embedding = HuggingFaceEmbeddings()
text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=100
)


def vectorize_cv():
    all_docs = []
    for resume_data in os.listdir(data_dir):
        if not resume_data.endswith(".pdf"):
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

        # ✅ Add metadata (VERY IMPORTANT)
        for doc in texts:
            doc.metadata["source"] = resume_data
        all_docs.extend(texts)

    vectordb =  create_vector_db(all_docs)

    print(f"✅ All CVs stored in vector DB at: {vector_db_path}")

    return vectordb


def create_vector_db(all_docs):
    vectordb = Chroma.from_documents(
        documents=all_docs,
        embedding=embedding,
        persist_directory=vector_db_path
    )
    return vectordb


