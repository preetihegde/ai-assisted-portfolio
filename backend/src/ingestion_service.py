from __future__ import annotations

import logging
from pathlib import Path
from xml.etree import ElementTree
from zipfile import ZipFile

from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.embedding_service import get_embedding_service
from src.vector_service import get_vector_service

logger = logging.getLogger(__name__)

_SUPPORTED_SUFFIXES = {".docx", ".md", ".pdf", ".txt"}


class IngestionService:

    def __init__(self) -> None:

        self.data_dir = (
            Path(__file__).resolve().parent.parent / "knowledge_repository"
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=150,
        )
        self.embedding_service = get_embedding_service()
        self.vector_service = get_vector_service()

    def ingest_all(self) -> dict:

        files = self._get_supported_files()

        if not files:
            return {
                "files": 0,
                "chunks": 0,
            }

        total_chunks = 0

        for path in files:
            total_chunks += self.ingest_file(path)

        logger.info(
            "Ingestion completed for %d files and %d chunks.",
            len(files),
            total_chunks,
        )

        return {
            "files": len(files),
            "chunks": total_chunks,
        }

    def ingest_source(
        self,
        source: str,
    ) -> dict:

        path = (self.data_dir / source).resolve()

        try:
            path.relative_to(self.data_dir)
        except ValueError as exc:
            raise FileNotFoundError(f"Source not found: {source}") from exc

        if not path.exists() or not path.is_file():
            raise FileNotFoundError(f"Source not found: {source}")

        if path.suffix.lower() not in _SUPPORTED_SUFFIXES:
            raise ValueError(
                f"Unsupported file type: {path.suffix}"
            )

        chunks = self.ingest_file(path)

        return {
            "files": 1,
            "chunks": chunks,
        }

    def ingest_file(self, path: Path) -> int:

        source = self._get_source(path)
        documents = self._load_documents(path)
        chunks = self.text_splitter.split_documents(documents)

        if not chunks:
            logger.info("No chunks generated for %s.", path.name)
            return 0

        texts = [chunk.page_content for chunk in chunks]
        embeddings = self.embedding_service.embed_documents(texts)

        rows = []

        for index, (chunk, embedding) in enumerate(
            zip(chunks, embeddings)
        ):
            metadata = dict(chunk.metadata)
            page = metadata.get("page")

            rows.append(
                {
                    "content": chunk.page_content,
                    "source": source,
                    "page": page,
                    "chunk_index": index,
                    "metadata": metadata,
                    "embedding": embedding,
                }
            )

        self.vector_service.delete_by_source(source)
        self.vector_service.insert_documents(rows)

        logger.info(
            "Ingested %d chunks from %s.",
            len(rows),
            source,
        )

        return len(rows)

    def _load_documents(self, path: Path) -> list[Document]:

        suffix = path.suffix.lower()

        source = self._get_source(path)

        if suffix in {".md", ".txt"}:
            content = path.read_text(encoding="utf-8")
            return [
                Document(
                    page_content=content,
                    metadata={"source": source},
                )
            ]

        if suffix == ".pdf":
            loader = PyPDFLoader(str(path))
            pages = loader.load()

            for page in pages:
                page.metadata["source"] = source

            return pages

        if suffix == ".docx":
            content = self._extract_docx_text(path)
            return [
                Document(
                    page_content=content,
                    metadata={"source": source},
                )
            ]

        raise ValueError(f"Unsupported file type: {path.suffix}")

    def _get_supported_files(self) -> list[Path]:

        return sorted(
            path
            for path in self.data_dir.rglob("*")
            if path.is_file() and path.suffix.lower() in _SUPPORTED_SUFFIXES
        )

    def _get_source(self, path: Path) -> str:

        return path.relative_to(self.data_dir).as_posix()

    def _extract_docx_text(self, path: Path) -> str:

        with ZipFile(path) as archive:
            document_xml = archive.read("word/document.xml")

        root = ElementTree.fromstring(document_xml)
        namespace = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
        paragraphs: list[str] = []

        for paragraph in root.findall(".//w:p", namespace):
            text_parts = [
                node.text
                for node in paragraph.findall(".//w:t", namespace)
                if node.text
            ]

            if text_parts:
                paragraphs.append("".join(text_parts))

        return "\n".join(paragraphs)


_ingestion_service: IngestionService | None = None


def get_ingestion_service() -> IngestionService:

    global _ingestion_service

    if _ingestion_service is None:
        _ingestion_service = IngestionService()

    return _ingestion_service
