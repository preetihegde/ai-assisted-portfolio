"""
Embedding Service

Responsible for generating vector embeddings.

Use:

embedding_service.embed_query(...)
embedding_service.embed_documents(...)
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod

from google import genai
from google.genai import types

from src.config import (
    EMBEDDING_DIMENSIONS,
    GOOGLE_API_KEY,
    EMBEDDING_MODEL,
    EMBEDDING_PROVIDER,
)

logger = logging.getLogger(__name__)


class EmbeddingError(Exception):
    """Raised when embedding generation fails."""


# ------------------------------------------------------------------
# Abstract Provider
# ------------------------------------------------------------------

class BaseEmbeddingProvider(ABC):

    @abstractmethod
    def embed_query(self, text: str) -> list[float]:
        pass

    @abstractmethod
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        pass


# ------------------------------------------------------------------
# Gemini Provider
# ------------------------------------------------------------------

class GeminiEmbeddingProvider(BaseEmbeddingProvider):

    def __init__(self):

        if not GOOGLE_API_KEY:
            raise EmbeddingError("GOOGLE_API_KEY is missing.")

        self.client = genai.Client(api_key=GOOGLE_API_KEY)

        logger.info(
            "Gemini Embedding Provider initialized "
            "(model=%s)",
            EMBEDDING_MODEL
        )

    def embed_query(self, text: str) -> list[float]:
        """
        Generate embedding for a single query.
        """

        try:

            response = self.client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=text,
                config=types.EmbedContentConfig(
                    taskType="RETRIEVAL_QUERY",
                    outputDimensionality=EMBEDDING_DIMENSIONS,
                ),
            )

            return response.embeddings[0].values

        except Exception as e:
            logger.exception("Failed generating query embedding.")
            raise EmbeddingError(str(e))

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """
        Generate embeddings for multiple documents.
        """

        try:
            response = self.client.models.embed_content(
                model=EMBEDDING_MODEL,
                contents=texts,
                config=types.EmbedContentConfig(
                    taskType="RETRIEVAL_DOCUMENT",
                    outputDimensionality=EMBEDDING_DIMENSIONS,
                ),
            )

            return [
                embedding.values
                for embedding in response.embeddings
            ]

        except Exception as e:
            logger.exception("Failed generating document embeddings.")
            raise EmbeddingError(str(e))


# ------------------------------------------------------------------
# Embedding Service
# ------------------------------------------------------------------

class EmbeddingService:

    def __init__(self):

        provider = EMBEDDING_PROVIDER.lower()

        if provider == "gemini":
            self.provider = GeminiEmbeddingProvider()

        else:
            raise ValueError(
                f"Unsupported embedding provider: {provider}"
            )

        logger.info("Embedding Service ready.")

    def embed_query(self, text: str) -> list[float]:

        logger.info("Generating query embedding.")

        return self.provider.embed_query(text)

    def embed_documents(
            self,
            texts: list[str]
    ) -> list[list[float]]:

        logger.info(
            "Generating embeddings for %d documents.",
            len(texts)
        )

        return self.provider.embed_documents(texts)


# ------------------------------------------------------------------
# Singleton
# ------------------------------------------------------------------

_embedding_service: EmbeddingService | None = None


def get_embedding_service() -> EmbeddingService:
    """
    Returns singleton EmbeddingService.
    """

    global _embedding_service

    if _embedding_service is None:
        _embedding_service = EmbeddingService()

    return _embedding_service
