from __future__ import annotations

import json
import logging
from pathlib import Path
import re
from dataclasses import dataclass

from groq import Groq

from src.config import GROQ_API_KEY, INTENT_MODEL

logger = logging.getLogger(__name__)

VALID_INTENTS = {
    "portfolio_question",
    "follow_up",
    "greeting",
    "gratitude",
    "closing",
    "assistant_identity",
    "general_knowledge",
    "roleplay",
    "prompt_injection",
    "unrelated",
}

_JSON_BLOCK_PATTERN = re.compile(
    r"\{.*\}",
    re.DOTALL,
)
_FOLLOW_UP_FRAGMENT_PATTERN = re.compile(
    r"^(?:"
    r"only(?:\s+in|\s+for|\s+on)?|"
    r"just|"
    r"more(?:\s+on|\s+about)?|"
    r"what about|"
    r"during|"
    r"about|"
    r"for|"
    r"in|"
    r"on|"
    r"with"
    r")\b",
    re.IGNORECASE,
)
_FOLLOW_UP_EXACT = {
    "only in ai",
    "backend only",
    "frontend only",
    "only ai",
    "just ai",
    "more on that",
    "tell me more",
    "continue",
    "go on",
    "during her internship",
    "during internship",
    "what about her skills",
    "what about her experience",
    "what about ai",
}
_PORTFOLIO_TOPIC_HINTS = {
    "experience",
    "project",
    "projects",
    "skills",
    "education",
    "career",
    "internship",
    "thesis",
    "research",
    "ai",
    "backend",
    "frontend",
    "work",
    "role",
}


@dataclass(frozen=True)
class IntentResult:
    intent: str
    confidence: float
    reason: str = ""


class IntentService:
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY)
        prompt_path = (
            Path(__file__).parent.parent
            / "prompts"
            / "intent_classifier_prompt.md"
        )
        self.prompt_template = prompt_path.read_text(
            encoding="utf-8"
        )

    def classify(
        self,
        question: str,
        history: list[dict],
    ) -> IntentResult:
        if self._should_force_follow_up(
            question=question,
            history=history,
        ):
            logger.info("Follow-up rescued by local heuristic.")
            return IntentResult(
                intent="follow_up",
                confidence=0.99,
                reason="Short contextual fragment depends on recent portfolio history.",
            )

        if not history:
            history_text = "No previous conversation."
        else:
            history_text = self._format_history(history[-6:])

        prompt = self.prompt_template.format(
            history_text=history_text,
            question=question,
        )

        logger.info("Classifying message intent.")

        response = self.client.chat.completions.create(
            model=INTENT_MODEL,
            temperature=0,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        content = response.choices[0].message.content or ""
        result = self._parse_result(content)

        logger.info(
            "Intent classified as %s (confidence %.2f).",
            result.intent,
            result.confidence,
        )

        if (
            result.intent in {"general_knowledge", "unrelated"}
            and self._looks_like_follow_up_fragment(question, history)
        ):
            logger.info(
                "Intent overridden to follow_up for contextual fragment."
            )
            return IntentResult(
                intent="follow_up",
                confidence=max(result.confidence, 0.8),
                reason="Fragment looks like a contextual follow-up.",
            )

        return result

    def _parse_result(self, content: str) -> IntentResult:
        raw = content.strip()
        match = _JSON_BLOCK_PATTERN.search(raw)

        if match:
            raw = match.group(0)

        payload = json.loads(raw)

        intent = str(payload.get("intent", "")).strip()
        confidence = float(payload.get("confidence", 0))
        reason = str(payload.get("reason", "")).strip()

        if intent not in VALID_INTENTS:
            raise ValueError(f"Invalid intent: {intent}")

        confidence = max(0.0, min(1.0, confidence))

        return IntentResult(
            intent=intent,
            confidence=confidence,
            reason=reason,
        )

    @staticmethod
    def _format_history(history: list[dict]) -> str:
        return "\n".join(
            f"{message['role'].capitalize()}: {message['content']}"
            for message in history
        )

    def _should_force_follow_up(
        self,
        question: str,
        history: list[dict],
    ) -> bool:
        if not history:
            return False

        return self._looks_like_follow_up_fragment(
            question=question,
            history=history,
        ) and self._history_is_portfolio_context(history)

    def _looks_like_follow_up_fragment(
        self,
        question: str,
        history: list[dict],
    ) -> bool:
        if not history:
            return False

        text = " ".join(question.lower().split())

        if not text:
            return False

        if text in _FOLLOW_UP_EXACT:
            return True

        word_count = len(text.split())
        last_assistant = self._last_assistant_message(history)

        if (
            word_count <= 5
            and _FOLLOW_UP_FRAGMENT_PATTERN.search(text)
        ):
            return True

        if (
            word_count <= 4
            and any(topic in text for topic in _PORTFOLIO_TOPIC_HINTS)
            and last_assistant
        ):
            return True

        if (
            word_count <= 6
            and last_assistant
            and "?" in last_assistant
        ):
            return True

        return False

    @staticmethod
    def _last_assistant_message(history: list[dict]) -> str:
        for message in reversed(history):
            if message.get("role") == "assistant":
                return message.get("content", "")
        return ""

    @staticmethod
    def _history_is_portfolio_context(history: list[dict]) -> bool:
        recent_text = " ".join(
            message.get("content", "").lower()
            for message in history[-4:]
        )
        return any(
            topic in recent_text
            for topic in _PORTFOLIO_TOPIC_HINTS
        )


_intent_service = None


def get_intent_service():
    global _intent_service

    if _intent_service is None:
        _intent_service = IntentService()

    return _intent_service
