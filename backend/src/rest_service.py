from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from src.utility_service import get_file_paths

# ✅ cache embeddings (load only once)
_embeddings = None

# ✅ cache vectors (load only once)
_vector_store = None

def get_embeddings():
    global _embeddings
    if _embeddings is None:
        print(f"Module: {__name__}")
        print(f"Embeddings id: {id(_embeddings)}")
        print("🔥 Loading embeddings once...")
        _embeddings = HuggingFaceEmbeddings()
        #     model_name="sentence-transformers/all-MiniLM-L6-v2"
        # )
    return _embeddings


def get_vector_store():
    global _vector_store

    if _vector_store is None:

        file_paths = get_file_paths()
        vector_db_path = file_paths["vector_db_path"]
        _vector_store = Chroma(
            persist_directory=vector_db_path,
            embedding_function=get_embeddings()
        )

    return _vector_store