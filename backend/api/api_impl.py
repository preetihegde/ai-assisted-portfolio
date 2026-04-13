from fastapi import APIRouter
from pydantic import BaseModel

from langchain_core.documents import Document
from backend.src.ingestion_service import vectorize_cv
from backend.src.rest_service import retrieve_vector_data
from backend.src.utility_service import get_file_paths
from backend.src.uttara_service import ask_question
from fastapi import Header, HTTPException
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

def verify_admin(x_api_key: str = Header(...)):
    if x_api_key != "SECRET_KEY":
        raise HTTPException(status_code=403, detail="Unauthorized")


class ChatRequest(BaseModel):
    question: str
    chat_history: list = []  # frontend sends this

class ChatResponse(BaseModel):
    answer: str

file_paths= get_file_paths()
vector_db_path = file_paths['vector_db_path']
# -------------------------
# Chat Endpoint
# -------------------------
@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, x_session_id: str = Header(None)):
    try:
        session_id = x_session_id

        if not session_id:
            raise HTTPException(
                status_code=400,
                detail="session_id is required in header"
            )

        answer = ask_question(
            question=req.question,
            session_id=session_id
        )

        return ChatResponse(answer=answer)

    except HTTPException:
        raise

    except Exception as error_msg:
        logger.exception(f"Error in /chat endpoint, {error_msg}")

        raise HTTPException(
            status_code=500,
            detail="Something went wrong while processing the request"
        )

# -------------------------
# Ingestion Endpoints
# -------------------------
@router.post("/documents")
def inngest():
    vectorize_cv()
    return {"message": "Vector DB Created successfully"}


@router.get("/documents")
def get_documents(database_name: str):
    vectordb = retrieve_vector_data(vector_db_path)
    data = vectordb.get()

    return {
        "documents": data["documents"],
        "metadata": data["metadatas"]
    }

@router.delete("/documents/{file_name}")
def delete_document(file_name: str):
    file_paths= get_file_paths()
    vector_db_path = file_paths['vector_db_path']
    vectordb = retrieve_vector_data(vector_db_path)

    vectordb.delete(where={"source": file_name})
    vectordb.persist()

    return {"message": f"{file_name} deleted"}

@router.delete("/documents/all")
def delete_document():
    vectordb = retrieve_vector_data(vector_db_path)

    vectordb.delete(where={})
    vectordb.persist()
    return {"message": "all files deleted"}

@router.patch("/documents/{file_name}")
def update_document(file_name: str, content: str):
    vectordb = retrieve_vector_data(vector_db_path)
    # no partial update → simulate
    vectordb.delete(where={"source": file_name})

    vectordb.add_documents([
        Document(page_content=content, metadata={"source": file_name})
    ])

    vectordb.persist()

    return {"message": "Document updated"}
# -------------------------
# Health Check
# -------------------------
@router.get("/health")
def health():
    return {"status": "ok"}
