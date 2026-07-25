from fastapi import APIRouter, Header, HTTPException

from src.embedding_service import get_embedding_service
from src.ingestion_service import get_ingestion_service
from src.models import (
    ChatRequest,
    ChatResponse,
    DeleteResponse,
    DocumentIngestionResponse,
    VectorCreateRequest,
    VectorListResponse,
    VectorResponse,
    VectorUpdateRequest,
)
from src.uttara_service import get_uttara_service
from src.vector_service import get_vector_service

router = APIRouter()


@router.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest,
    x_session_id: str = Header(..., alias="X-Session-Id"),
):

    try:
        uttara = get_uttara_service()

        return uttara.ask_question(
            question=request.question,
            session_id=x_session_id,
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.post(
    "/documents/ingest",
    response_model=DocumentIngestionResponse,
)
def ingest_documents():

    try:
        ingestion_service = get_ingestion_service()
        return ingestion_service.ingest_all()

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


@router.post(
    "/documents/ingest/{source:path}",
    response_model=DocumentIngestionResponse,
)
def ingest_document_by_source(source: str):

    try:
        ingestion_service = get_ingestion_service()
        return ingestion_service.ingest_source(source)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/vectors",
    response_model=VectorResponse,
)
def create_vector(request: VectorCreateRequest):

    try:
        embedding_service = get_embedding_service()
        vector_service = get_vector_service()

        row = {
            "content": request.content,
            "source": request.source,
            "page": request.page,
            "chunk_index": request.chunk_index,
            "metadata": request.metadata,
            "embedding": embedding_service.embed_query(request.content),
        }

        inserted = vector_service.insert_documents([row])
        return inserted[0] if inserted else row

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/vectors",
    response_model=VectorListResponse,
)
def get_vectors(
    source: str | None = None,
    limit: int = 100,
):

    try:
        vector_service = get_vector_service()
        items = vector_service.get_documents(
            source=source,
            limit=limit,
        )
        return {
            "items": items,
            "count": len(items),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/vectors/{source}/{chunk_index}",
    response_model=VectorResponse,
)
def get_vector(
    source: str,
    chunk_index: int,
):

    try:
        vector_service = get_vector_service()
        item = vector_service.get_document(source, chunk_index)

        if item is None:
            raise HTTPException(
                status_code=404,
                detail="Vector not found.",
            )

        return item

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/vectors/{source}/{chunk_index}",
    response_model=VectorResponse,
)
def update_vector(
    source: str,
    chunk_index: int,
    request: VectorUpdateRequest,
):

    try:
        vector_service = get_vector_service()
        current = vector_service.get_document(source, chunk_index)

        if current is None:
            raise HTTPException(
                status_code=404,
                detail="Vector not found.",
            )

        payload = {}

        if request.content is not None:
            payload["content"] = request.content
            payload["embedding"] = get_embedding_service().embed_query(
                request.content
            )

        if request.page is not None:
            payload["page"] = request.page

        if request.metadata is not None:
            payload["metadata"] = request.metadata

        if not payload:
            return current

        updated = vector_service.update_document(
            source=source,
            chunk_index=chunk_index,
            payload=payload,
        )

        if updated is None:
            raise HTTPException(
                status_code=404,
                detail="Vector not found.",
            )

        return updated

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/vectors/{source}/{chunk_index}",
    response_model=DeleteResponse,
)
def delete_vector(
    source: str,
    chunk_index: int,
):

    try:
        vector_service = get_vector_service()

        if vector_service.get_document(source, chunk_index) is None:
            raise HTTPException(
                status_code=404,
                detail="Vector not found.",
            )

        vector_service.delete_document(source, chunk_index)

        return {
            "deleted": True,
            "source": source,
            "chunk_index": chunk_index,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/vectors/{source}",
    response_model=DeleteResponse,
)
def delete_vectors_by_source(source: str):

    try:
        vector_service = get_vector_service()
        vector_service.delete_by_source(source)

        return {
            "deleted": True,
            "source": source,
            "chunk_index": None,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
