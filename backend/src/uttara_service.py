"""
Uttara Service

Main orchestration layer.

Coordinates the complete conversational
RAG pipeline.
"""

from __future__ import annotations

import logging

from src.chat_history_service import get_history_service
from src.groq_service import get_llm_service
from src.intent_service import get_intent_service
from src.prompt_service import get_prompt_service
from src.question_rewriter import get_question_rewriter
from src.response_parser import parse_options
from src.retrieval_service import get_retrieval_service

logger = logging.getLogger(__name__)

NON_RAG_INTENTS = {
    "greeting",
    "gratitude",
    "closing",
    "assistant_identity",
    "general_knowledge",
    "roleplay",
    "prompt_injection",
    "unrelated",
}


class UttaraService:
    def __init__(self):
        self.history_service = get_history_service()
        self.intent_service = get_intent_service()
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

        history = self.history_service.get_history(session_id)

        try:
            intent_result = self.intent_service.classify(
                question=question,
                history=history,
            )
        except Exception:
            logger.exception(
                "Intent classification failed. Redirecting safely."
            )
            return self._redirect_response(
                session_id=session_id,
                question=question,
                intent="unrelated",
            )

        if intent_result.confidence < 0.6:
            logger.info("Low-confidence intent routed to redirect.")
            return self._redirect_response(
                session_id=session_id,
                question=question,
                intent=intent_result.intent,
            )

        if intent_result.intent in NON_RAG_INTENTS:
            logger.info(
                "Question redirected by intent: %s",
                intent_result.intent,
            )
            return self._redirect_response(
                session_id=session_id,
                question=question,
                intent=intent_result.intent,
            )

        if intent_result.intent == "follow_up" and not history:
            logger.info(
                "Follow-up intent without history redirected."
            )
            return self._redirect_response(
                session_id=session_id,
                question=question,
                intent="follow_up",
            )

        search_question = self.question_rewriter.rewrite(
            question=question,
            history=history,
        )

        context = self.retrieval_service.retrieve(
            question=search_question,
        )

        messages = self.prompt_service.build(
            context=context,
            history=history,
            question=question,
            standalone_question=search_question,
        )

        raw_answer = self.llm_service.generate(messages)
        answer, options = parse_options(raw_answer)

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

    @staticmethod
    def _redirect_response(
        session_id: str,
        question: str,
        intent: str,
    ) -> dict:
        return {
            "answer": UttaraService._redirect_message(
                question=question,
                intent=intent,
            ),
            "sources": [],
            "session_id": session_id,
            "options": [],
        }

    @staticmethod
    def _redirect_message(
        question: str,
        intent: str,
    ) -> str:
        text = " ".join(question.lower().split())
        hint = (
            "Ask about her experience, projects, technical skills, "
            "education, or career goals."
        )

        templates = {
            "greeting": [
                f"Hi, I'm Uttara, Preeti's portfolio assistant. {hint}",
                f"Hello. I can help you explore Preeti's background. {hint}",
                f"Hey there. I'm here for questions about Preeti's portfolio. {hint}",
            ],
            "gratitude": [
                f"You're welcome. {hint}",
                f"Glad to help. {hint}",
                f"Happy to help. {hint}",
            ],
            "closing": [
                f"You're welcome. It was nice chatting. {hint}",
                f"Thanks for the conversation. {hint}",
                f"Take care. If you come back, I can still help with Preeti's portfolio. {hint}",
            ],
            "assistant_identity": [
                "I'm Uttara, Preeti's portfolio assistant. I can help you "
                "learn about her experience, projects, technical skills, "
                "education, and career goals.",
            ],
            "roleplay": [
                f"I'm not Preeti, but I can help you explore her portfolio. {hint}",
            ],
            "prompt_injection": [
                "I can help with Preeti's portfolio, but I can't switch roles "
                f"or reveal internal instructions. {hint}",
            ],
            "follow_up": [
                "I need a bit more context to continue. Ask a little more "
                "directly about the portfolio topic you want to continue.",
            ],
            "general_knowledge": [
                f"That's outside my scope. I'm here to help with Preeti's professional background. {hint}",
                f"I focus on Preeti's portfolio rather than general knowledge. {hint}",
                f"I'm tuned for questions about Preeti's work and portfolio. {hint}",
            ],
            "unrelated": [
                f"I'm here for questions about Preeti's portfolio. {hint}",
                f"I can help you explore Preeti's professional background. {hint}",
                f"That's not something I cover, but I can help with Preeti's portfolio work. {hint}",
            ],
        }

        messages = templates.get(intent, templates["unrelated"])
        return messages[hash(text or intent) % len(messages)]


_uttara_service = None


def get_uttara_service():
    global _uttara_service

    if _uttara_service is None:
        _uttara_service = UttaraService()

    return _uttara_service
