"""
Vector Service

Handles all interactions with Supabase pgvector.

Responsibilities:
- Store document embeddings
- Read, update, and delete stored chunks
- Perform similarity search

"""

from __future__ import annotations

import logging
from typing import Any

from supabase import create_client, Client

from src.config import (
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)

logger = logging.getLogger(__name__)


class VectorStoreError(Exception):
    """Raised when vector store operations fail."""


class VectorService:

    def __init__(self):

        if not SUPABASE_URL:
            raise VectorStoreError("SUPABASE_URL missing.")

        if not SUPABASE_SERVICE_ROLE_KEY:
            raise VectorStoreError(
                "SUPABASE_SERVICE_ROLE_KEY missing."
            )

        self.client: Client = create_client(
            SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY,
        )

        logger.info("Connected to Supabase.")

    def insert_documents(
        self,
        documents: list[dict]
    ) -> list[dict]:
        """
        Insert documents into Supabase.

        Expected document:

        {
            "content": "...",
            "source": "...",
            "page": 1,
            "chunk_index": 0,
            "metadata": {},
            "embedding": [...]
        }
        """

        try:

            response = self.client.table("documents").insert(
                documents
            ).execute()

            logger.info(
                "Inserted %d documents.",
                len(documents)
            )

            return response.data or []

        except Exception as e:
            logger.exception("Insert failed.")
            raise VectorStoreError(str(e))

    def get_documents(
        self,
        source: str | None = None,
        limit: int = 100,
    ) -> list[dict]:
        """
        Return stored vectors, optionally filtered by source.
        """

        try:

            query = (
                self.client.table("documents")
                .select("content,source,page,chunk_index,metadata")
                .order("source")
                .order("chunk_index")
                .limit(limit)
            )

            if source:
                query = query.eq("source", source)

            response = query.execute()
            return response.data or []

        except Exception as e:
            logger.exception("Get documents failed.")
            raise VectorStoreError(str(e))

    def get_document(
        self,
        source: str,
        chunk_index: int,
    ) -> dict | None:
        """
        Return one stored vector row.
        """

        try:

            response = (
                self.client.table("documents")
                .select("content,source,page,chunk_index,metadata")
                .eq("source", source)
                .eq("chunk_index", chunk_index)
                .limit(1)
                .execute()
            )

            data = response.data or []
            return data[0] if data else None

        except Exception as e:
            logger.exception("Get document failed.")
            raise VectorStoreError(str(e))

    def delete_by_source(
        self,
        source: str,
    ) -> None:
        """
        Delete all chunks for a given source file.
        """

        try:

            self.client.table("documents").delete().eq(
                "source",
                source,
            ).execute()

            logger.info(
                "Deleted existing chunks for source %s.",
                source,
            )

        except Exception as e:
            logger.exception("Delete by source failed.")
            raise VectorStoreError(str(e))

    def delete_document(
        self,
        source: str,
        chunk_index: int,
    ) -> None:
        """
        Delete a single chunk identified by source and chunk index.
        """

        try:

            (
                self.client.table("documents")
                .delete()
                .eq("source", source)
                .eq("chunk_index", chunk_index)
                .execute()
            )

            logger.info(
                "Deleted chunk %s#%d.",
                source,
                chunk_index,
            )

        except Exception as e:
            logger.exception("Delete document failed.")
            raise VectorStoreError(str(e))

    def update_document(
        self,
        source: str,
        chunk_index: int,
        payload: dict[str, Any],
    ) -> dict | None:
        """
        Update a single stored vector row.
        """

        try:

            response = (
                self.client.table("documents")
                .update(payload)
                .eq("source", source)
                .eq("chunk_index", chunk_index)
                .execute()
            )

            data = response.data or []
            return data[0] if data else None

        except Exception as e:
            logger.exception("Update document failed.")
            raise VectorStoreError(str(e))

    def similarity_search(
        self,
        embedding: list[float],
        match_count: int = 5,
        threshold: float = 0.7,
    ) -> list[dict]:
        """
        Perform similarity search using the SQL
        function `match_documents`.
        """

        try:

            response = (
                self.client.rpc(
                    "match_documents",
                    {
                        "query_embedding": embedding,
                        "match_threshold": threshold,
                        "match_count": match_count,
                    },
                )
                .execute()
            )

            logger.info(
                "Retrieved %d matching documents.",
                len(response.data),
            )

            return response.data

        except Exception as e:
            logger.exception("Similarity search failed.")
            raise VectorStoreError(str(e))


_vector_service: VectorService | None = None


def get_vector_service() -> VectorService:

    global _vector_service

    if _vector_service is None:
        _vector_service = VectorService()

    return _vector_service
