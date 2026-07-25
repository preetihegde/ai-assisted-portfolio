import os
from pathlib import Path

from dotenv import load_dotenv

_BACKEND_DIR = Path(__file__).resolve().parent.parent
_ROOT_DIR = _BACKEND_DIR.parent

load_dotenv(_BACKEND_DIR / ".env", override=True)
load_dotenv(_ROOT_DIR / ".env", override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

EMBEDDING_PROVIDER = os.getenv("EMBEDDING_PROVIDER", "gemini")
_EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "gemini-embedding-001"
)
EMBEDDING_DIMENSIONS = int(
    os.getenv("EMBEDDING_DIMENSIONS", "768")
)
EMBEDDING_MODEL = (
    "gemini-embedding-001"
    if _EMBEDDING_MODEL in {"models/text-embedding-004", "models/embedding-001"}
    else _EMBEDDING_MODEL
)

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq")
LLM_MODEL = os.getenv(
    "LLM_MODEL",
    "llama-3.3-70b-versatile"
)

# Small, fast model — only rewrites follow-ups into standalone questions.
REWRITER_MODEL = os.getenv(
    "REWRITER_MODEL",
    "llama-3.1-8b-instant"
)
