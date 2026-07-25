"""
Question Rewriter

Converts follow-up questions into standalone questions
using conversation history.

Example:

History:
User: Tell me about Preeti's thesis.

Question:
What model was used?

↓

Standalone:
What model did Preeti use in her Master's thesis?
"""

from __future__ import annotations

import logging
import re

from groq import Groq

from src.config import GROQ_API_KEY, REWRITER_MODEL

logger = logging.getLogger(__name__)

_LABEL_PATTERN = re.compile(
    r"^\s*standalone\s+question\s*:\s*",
    re.IGNORECASE,
)


class QuestionRewriter:

    def __init__(self):

        self.client = Groq(api_key=GROQ_API_KEY)

    def rewrite(
        self,
        question: str,
        history: list[dict],
    ) -> str:
        """
        Rewrite follow-up questions into standalone questions.
        """

        if not history:
            return question

        conversation = self._format_history(history)

        prompt = f"""
You are a query rewriting assistant.

Your task is to rewrite the user's latest question into a
self-contained question that can be understood without
conversation history.

Rules:

- Preserve the user's intent.
- Do NOT answer the question.
- Only rewrite it.
- If the question is already standalone,
  return it unchanged.
- If the latest message is a confirmation or a choice rather
  than a question ("Yes", "the first one", "that one", or the
  bare name of something), resolve it into a full question
  about the specific item the assistant just offered.
- Output only the question, on one line.
  No label, no quotes, no explanation.

Conversation:

{conversation}

Latest Question:

{question}

Standalone Question:
"""

        logger.info("Rewriting question.")

        try:

            response = self.client.chat.completions.create(
                model=REWRITER_MODEL,
                temperature=0,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
            )

        except Exception:

            # Retrieval on the raw question is still better than a
            # failed request, so degrade instead of raising.
            logger.exception(
                "Rewrite failed. Falling back to original question."
            )

            return question

        rewritten = self._sanitize(
            response.choices[0].message.content or "",
            fallback=question,
        )

        logger.info(
            "Original: %s",
            question,
        )

        logger.info(
            "Rewritten: %s",
            rewritten,
        )

        return rewritten

    @staticmethod
    def _sanitize(rewritten: str, fallback: str) -> str:
        """
        Reduce the model's output to a single usable question.

        Small models sometimes echo the prompt label or append
        commentary, and either would poison the retrieval query.
        """

        text = _LABEL_PATTERN.sub("", rewritten.strip())

        for line in text.splitlines():

            line = line.strip().strip('"').strip()

            if line:
                return line

        logger.warning(
            "Rewrite produced no usable text. Using original question."
        )

        return fallback

    @staticmethod
    def _format_history(history: list[dict]) -> str:

        conversation = []

        for message in history:

            role = message["role"].capitalize()

            conversation.append(
                f"{role}: {message['content']}"
            )

        return "\n".join(conversation)


_question_rewriter = None


def get_question_rewriter():

    global _question_rewriter

    if _question_rewriter is None:
        _question_rewriter = QuestionRewriter()

    return _question_rewriter