"""
Groq Service

Responsible for generating responses using the configured LLM.

Input:
    Chat messages

Output:
    Assistant response
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod

from groq import Groq

from src.config import (
    GROQ_API_KEY,
    LLM_MODEL,
    LLM_PROVIDER,
)

logger = logging.getLogger(__name__)


class LLMError(Exception):
    """Raised when LLM generation fails."""


# ----------------------------------------------------------------------
# Base Provider
# ----------------------------------------------------------------------

class BaseLLMProvider(ABC):

    @abstractmethod
    def generate(
        self,
        messages: list[dict],
        temperature: float = 0.2,
    ) -> str:
        pass


# ----------------------------------------------------------------------
# Groq Provider
# ----------------------------------------------------------------------

class GroqProvider(BaseLLMProvider):

    def __init__(self):

        if not GROQ_API_KEY:
            raise LLMError("GROQ_API_KEY missing.")

        self.client = Groq(api_key=GROQ_API_KEY)

        logger.info(
            "Groq Provider initialized (%s)",
            LLM_MODEL,
        )

    def generate(
        self,
        messages: list[dict],
        temperature: float = 0.2,
    ) -> str:

        try:

            response = self.client.chat.completions.create(
                model=LLM_MODEL,
                messages=messages,
                temperature=temperature,
            )

            return (
                response
                .choices[0]
                .message
                .content
                .strip()
            )

        except Exception as e:

            logger.exception("LLM generation failed.")

            raise LLMError(str(e))


# ----------------------------------------------------------------------
# LLM Service
# ----------------------------------------------------------------------

class LLMService:

    def __init__(self):

        provider = LLM_PROVIDER.lower()

        if provider == "groq":
            self.provider = GroqProvider()
        else:
            raise ValueError(
                f"Unsupported provider: {provider}"
            )

        logger.info("LLM Service initialized.")

    def generate(
        self,
        messages: list[dict],
        temperature: float = 0.2,
    ) -> str:

        return self.provider.generate(
            messages,
            temperature,
        )


_llm_service = None


def get_llm_service():

    global _llm_service

    if _llm_service is None:
        _llm_service = LLMService()

    return _llm_service