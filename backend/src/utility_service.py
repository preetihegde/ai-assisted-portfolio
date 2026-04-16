import os
import logging
from dotenv import load_dotenv
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_groq import ChatGroq
from pathlib import Path

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory session store
session_store: dict[str, ChatMessageHistory] = {}


def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in session_store:
        session_store[session_id] = ChatMessageHistory()
    return session_store[session_id]


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def get_file_paths():
    logger.info("getting FILE paths lets see ...")
    resume_data_path = os.getenv("RESUME_FILE_LOCATION")
    logger.info(f"getting FILE RESUME_FILE_LOCATION {RESUME_FILE_LOCATION} from {resume_data_path} ...")
    vector_db_name = os.getenv("VECTOR_DB_NAME")
    logger.info(f"getting FILE VECTOR_DB_NAME {VECTOR_DB_NAME} ...")
    system_prompt_file_path = os.getenv("SYSTEM_PROMPT_FILE_PATH")
    logger.info(f"getting FILE SYSTEM_PROMPT_FILE_PATH {system_prompt_file_path} ...")

    # Validate required env vars
    missing = [k for k, v in {
        "RESUME_FILE_LOCATION": resume_data_path,
        "VECTOR_DB_NAME": vector_db_name,
        "SYSTEM_PROMPT_FILE_PATH": system_prompt_file_path,
    }.items() if not v]

    if missing:
        raise EnvironmentError(
            f"Missing required environment variables: {', '.join(missing)}. "
            "Set them in Render Dashboard → Environment tab."
        )

    # src/ → backend/ → repo root: go up two levels from src/
    working_dir = os.path.dirname(os.path.abspath(__file__))
    logger.info(f"getting FILE working_dir {working_dir} ...")
    backend_dir = os.path.dirname(working_dir)
    logger.info(f"getting FILE backend_dir {backend_dir} ...")

    
    return {
        "data_dir": os.path.join(backend_dir, resume_data_path),
        "system_prompt_file_loc": os.path.join(backend_dir, system_prompt_file_path),
        "vector_db_path": os.path.join(backend_dir, vector_db_name),
    }


def get_groq_model_parameters():
    api_key = os.getenv("GROQ_API_KEY")
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    if not api_key:
        raise EnvironmentError(
            "GROQ_API_KEY is not set. Add it in Render Dashboard → Environment tab."
        )

    return ChatGroq(model=model, temperature=0, api_key=api_key)


def load_system_prompt() -> str:
    file_paths = get_file_paths()
    prompt_path = Path(file_paths["system_prompt_file_loc"])

    if not prompt_path.exists():
        raise FileNotFoundError(
            f"System prompt not found at: {prompt_path}. "
            "Check SYSTEM_PROMPT_FILE_PATH env var."
        )

    return prompt_path.read_text(encoding="utf-8")
