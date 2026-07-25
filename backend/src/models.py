from typing import Any, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str


class Source(BaseModel):
    source: str
    page: Optional[int] = None
    similarity: float


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
    session_id: str
    options: list[str] = Field(default_factory=list)


class DocumentIngestionResponse(BaseModel):
    files: int
    chunks: int


class VectorCreateRequest(BaseModel):
    content: str
    source: str
    page: Optional[int] = None
    chunk_index: int = 0
    metadata: dict[str, Any] = Field(default_factory=dict)


class VectorUpdateRequest(BaseModel):
    content: Optional[str] = None
    page: Optional[int] = None
    metadata: Optional[dict[str, Any]] = None


class VectorResponse(BaseModel):
    content: str
    source: str
    page: Optional[int] = None
    chunk_index: int
    metadata: dict[str, Any] = Field(default_factory=dict)


class VectorListResponse(BaseModel):
    items: list[VectorResponse]
    count: int


class DeleteResponse(BaseModel):
    deleted: bool
    source: str
    chunk_index: Optional[int] = None
