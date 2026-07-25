"""
Uttara Service

Main orchestration layer.

Coordinates the complete conversational
RAG pipeline.

Pipeline

Question
    ↓
History
    ↓
Question Rewrite
    ↓
Retrieve Context
    ↓
Build Prompt
    ↓
Generate Answer
    ↓
Parse Follow-up Options
    ↓
Save History
"""

from __future__ import annotations

import logging

from src.chat_history_service import get_history_service
from src.retrieval_service import get_retrieval_service
from src.prompt_service import get_prompt_service
from src.groq_service import get_llm_service
from src.question_rewriter import get_question_rewriter
from src.response_parser import parse_options

logger = logging.getLogger(__name__)


class UttaraService:

    def __init__(self):

        self.history_service = get_history_service()
        self.question_rewriter = get_question_rewriter()
        self.retrieval_service = get_retrieval_service()
        self.prompt_service = get_prompt_service()
        self.llm_service = get_llm_service()

    def ask_question(
        self,
        question: str,
        session_id: str,
    ) -> dict:

        logger.info("New question received.")

        # ----------------------------------------------------
        # Load conversation history
        # ----------------------------------------------------

        history = self.history_service.get_history(
            session_id
        )

        # ----------------------------------------------------
        # Resolve follow-ups into a standalone question
        #
        # Replies like "Yes" or "the first one" carry no meaning
        # on their own and would embed into noise.
        # ----------------------------------------------------

        search_question = self.question_rewriter.rewrite(
            question=question,
            history=history,
        )

        # ----------------------------------------------------
        # Retrieve relevant context
        # ----------------------------------------------------

        context = self.retrieval_service.retrieve(
            question=search_question,
        )

        # ----------------------------------------------------
        # Build prompt
        # ----------------------------------------------------

        messages = self.prompt_service.build(
            context=context,
            history=history,
            question=question,
            standalone_question=search_question,
        )

        # ----------------------------------------------------
        # Generate answer
        # ----------------------------------------------------

        raw_answer = self.llm_service.generate(messages)

        # ----------------------------------------------------
        # Split the follow-up options marker off the answer
        # ----------------------------------------------------

        answer, options = parse_options(raw_answer)

        # ----------------------------------------------------
        # Save conversation
        #
        # The cleaned answer is stored so the marker never reaches
        # the rewriter or a later prompt.
        # ----------------------------------------------------

        self.history_service.save_message(
            session_id,
            "user",
            question,
        )

        self.history_service.save_message(
            session_id,
            "assistant",
            answer,
        )

        logger.info("Question answered successfully.")

        return {
            "answer": answer,
            "sources": context,
            "session_id": session_id,
            "options": options,
        }


_uttara_service = None


def get_uttara_service():

    global _uttara_service

    if _uttara_service is None:
        _uttara_service = UttaraService()

    return _uttara_service
