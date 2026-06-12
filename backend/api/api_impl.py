from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

import logging
logger = logging.getLogger(__name__)

logger.info("Importing uttara_service")
from src.uttara_service import ask_question

logger.info("Imported uttara_service")

logger.info("Importing ingestion_service")
from src.ingestion_service import vectorize_cv

logger.info("Imported ingestion_service")

logger = logging.getLogger(__name__)
logger.info("Inside api impl.........")
router = APIRouter()
logger.info("Inside api impl : API ROUTER Start.........")
# -------------------------
# Models
# -------------------------

class ChatRequest(BaseModel):
    question: str
    chat_history: list = None  # ✅ fixed

class ChatResponse(BaseModel):
    answer: str


# -------------------------
# Helper
# -------------------------


# -------------------------
# Chat Endpoint
# -------------------------

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, x_session_id: str = Header(None)):
    try:
        if not x_session_id:
            raise HTTPException(status_code=400, detail="session_id required in header")

        answer = ask_question(
            question=req.question,
            session_id=x_session_id
        )

        return ChatResponse(answer=answer)

    except HTTPException:
        raise

    except Exception as e:
        logger.exception(f"Error in /chat: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# -------------------------
# Ingestion
# -------------------------
#
@router.post("/documents")
def ingest_documents():
    vectorize_cv()
    return {"message": "Vector DB created successfully"}
#
#
# # -------------------------
# # GET Documents
# # -------------------------
#
# @router.get("/documents")
# def get_documents():
#     vectordb = get_db()
#     data = vectordb.get()
#
#     return {
#         "documents": data.get("documents", []),
#         "metadata": data.get("metadatas", [])
#     }
#
#
# # -------------------------
# # DELETE specific file
# # -------------------------
#
# @router.delete("/documents/{file_name}")
# def delete_document(file_name: str):
#     vectordb = get_db()
#
#     vectordb.delete(where={"source": file_name})
#     vectordb.persist()
#
#     return {"message": f"{file_name} deleted"}
#
#
# # -------------------------
# # DELETE ALL
# # -------------------------
#
# @router.delete("/documents")
# def delete_all_documents():
#     vectordb = get_db()
#
#     db_data = vectordb.get()
#     vectordb.delete(ids=db_data["ids"])
#
#     return {"message": "All documents deleted"}
#
#
# # -------------------------
# # UPDATE (PUT/PATCH)
# # -------------------------
#
# @router.patch("/documents/{file_name}")
# def update_document(file_name: str, content: str):
#     vectordb = os.getenv()
#
#     vectordb.delete(where={"source": file_name})
#
#     vectordb.add_documents([
#         Document(page_content=content, metadata={"source": file_name})
#     ])
#
#     vectordb.persist()
#
#     return {"message": "Document updated"}


# -------------------------
# Health Check
# -------------------------

@router.get("/health")
def health():
    return {"status": "ok"}
