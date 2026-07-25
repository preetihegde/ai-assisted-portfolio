from __future__ import annotations

from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class PromptService:

    def __init__(self):

        prompt_path = (
            Path(__file__).parent.parent
            / "prompts"
            / "system_prompt.md"
        )

        self.system_prompt = prompt_path.read_text(
            encoding="utf-8"
        )

    def build(
        self,
        context: list[dict],
        history: list[dict],
        question: str,
        standalone_question: str | None = None,
    ) -> list[dict]:

        context_text = self._format_context(context)

        history_text = self._format_history(history)

        sections = [
            f"Retrieved Context\n\n{context_text}",
            f"Conversation History\n\n{history_text}",
            f"Current Question\n\n{question}",
        ]

        # Only shown when the question was a follow-up, so the model
        # sees both the user's literal words and the resolved intent.
        if (
            standalone_question
            and standalone_question.strip() != question.strip()
        ):
            sections.append(
                "Resolved Question\n\n"
                f"{standalone_question}\n\n"
                "The current question is a follow-up. The resolved "
                "question above states what the user is asking. "
                "Answer that."
            )

        return [
            {
                "role": "system",
                "content": self.system_prompt,
            },
            {
                "role": "user",
                "content": "\n\n".join(sections),
            },
        ]

    @staticmethod
    def _format_context(context):

        if not context:
            return "No relevant context retrieved."

        lines = []

        for doc in context:

            source = doc.get("source", "Unknown")

            page = doc.get("page")

            if page is not None:
                header = f"[{source} | Page {page}]"
            else:
                header = f"[{source}]"

            lines.append(
                f"{header}\n{doc['content']}"
            )

        return "\n\n".join(lines)

    @staticmethod
    def _format_history(history):

        if not history:
            return "No previous conversation."

        return "\n".join(
            f"{m['role'].capitalize()}: {m['content']}"
            for m in history
        )


_prompt_service = None


def get_prompt_service():

    global _prompt_service

    if _prompt_service is None:
        _prompt_service = PromptService()

    return _prompt_service
