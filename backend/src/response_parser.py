"""
Response Parser

Separates machine-readable follow-up options from the
user-facing answer.

The system prompt asks the model to end any answer that offers a
choice with a single marker line:

    [[OPTIONS: FileChatAI | Uttara AI | Document Intelligence]]

The marker is stripped here and returned separately, so the
frontend can render the choices while `answer` stays clean
markdown.
"""

from __future__ import annotations

import logging
import re

logger = logging.getLogger(__name__)

MAX_OPTIONS = 6

# Option names never contain "]", so excluding it keeps a malformed
# marker from swallowing the rest of the answer.
_OPTIONS_PATTERN = re.compile(
    r"\[\[\s*OPTIONS\s*:\s*(?P<body>[^\]]*?)\s*\]\]",
    re.IGNORECASE,
)

_BLANK_LINES_PATTERN = re.compile(r"\n{3,}")


def parse_options(answer: str) -> tuple[str, list[str]]:
    """
    Split an answer into (clean_answer, options).

    Returns an empty option list when no marker is present.
    """

    if not answer:
        return "", []

    options: list[str] = []
    seen: set[str] = set()

    for match in _OPTIONS_PATTERN.finditer(answer):

        for raw in match.group("body").split("|"):

            # Collapse any internal whitespace the model introduced.
            option = " ".join(raw.split())

            if not option:
                continue

            key = option.lower()

            if key in seen:
                continue

            seen.add(key)
            options.append(option)

    cleaned = _OPTIONS_PATTERN.sub("", answer)
    cleaned = _BLANK_LINES_PATTERN.sub("\n\n", cleaned).strip()

    if len(options) > MAX_OPTIONS:

        logger.info(
            "Truncating %d options to %d.",
            len(options),
            MAX_OPTIONS,
        )

        options = options[:MAX_OPTIONS]

    if options and not cleaned:
        logger.warning(
            "Answer contained an OPTIONS marker but no prose."
        )

    return cleaned, options
