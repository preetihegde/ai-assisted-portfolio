import os
from dotenv import load_dotenv
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_groq import ChatGroq
from pathlib import Path


load_dotenv()

# In-memory session store (replace with Redis/DB for production)
session_store: dict[str, ChatMessageHistory] = {}

def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def get_file_paths():
    resume_data_path = os.getenv("RESUME_FILE_LOCATION")
    vector_db_name = os.getenv("VECTOR_DB_NAME")
    system_prompt_file_path = os.getenv("SYSTEM_PROMPT_FILE_PATH")
    # ✅ Paths (safe for Windows)
    working_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.dirname(working_dir)
    data_dir = os.path.join(backend_dir, resume_data_path)
    vector_db_path = os.path.join(backend_dir,vector_db_name)
    system_prompt_file_loc = os.path.join(backend_dir,system_prompt_file_path)
    return {
        "data_dir":data_dir,
        "system_prompt_file_loc":system_prompt_file_loc,
        "vector_db_path":vector_db_path
    }



def get_groq_model_parameters():
    return ChatGroq(
        model=os.getenv("GROQ_MODEL"),
        temperature=0,
        api_key=os.getenv("GROQ_API_KEY")
    )

def load_system_prompt() -> str:
    file_paths = get_file_paths()
    prompt_data = Path(file_paths['system_prompt_file_loc'])
    return prompt_data.read_text(encoding="utf-8")