"""
Retrieval Service

Responsible for retrieving relevant context
from the vector database.


"""

from __future__ import annotations

import logging

from src.embedding_service import get_embedding_service
from src.vector_service import get_vector_service

logger = logging.getLogger(__name__)


class RetrievalService:

    def __init__(self):

        self.embedding_service = get_embedding_service()
        self.vector_service = get_vector_service()

    def retrieve(
        self,
        question: str,
        top_k: int = 7,
        similarity_threshold: float = 0.52,
    ) -> list[dict]:
        """
        Retrieve the most relevant chunks.

        Returns:
            [
                {
                    "content": "...",
                    "source": "...",
                    "page": 1,
                    "similarity": 0.92
                }
            ]
        """

        logger.info("Starting retrieval pipeline.")

        embedding = self.embedding_service.embed_query(question)

        results = self.vector_service.similarity_search(
            embedding=embedding,
            match_count=top_k,
            threshold=similarity_threshold,
        )

        results = self._deduplicate(results)

        logger.info(
            "Retrieved %d unique chunks.",
            len(results)
        )

        return results

    @staticmethod
    def _deduplicate(results: list[dict]) -> list[dict]:
        """
        Remove duplicate chunks.
        """

        seen = set()
        unique = []

        for item in results:

            content = item["content"].strip()

            if content in seen:
                continue

            seen.add(content)
            unique.append(item)

        return unique


_retrieval_service = None


def get_retrieval_service():

    global _retrieval_service

    if _retrieval_service is None:
        _retrieval_service = RetrievalService()

    return _retrieval_service