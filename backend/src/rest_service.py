from langchain_chroma import Chroma

# ✅ cache embeddings (load only once)
_embeddings = None

def get_embeddings():
    global _embeddings
    if _embeddings is None:
        from langchain_huggingface import HuggingFaceEmbeddings
        print("🔥 Loading embeddings once...")
        _embeddings = HuggingFaceEmbeddings()
    return _embeddings


def retrieve_vector_data(db_path):
    embeddings = get_embeddings()

    vector_retrival = Chroma(
        persist_directory=db_path,
        embedding_function=embeddings
    )
    return vector_retrival