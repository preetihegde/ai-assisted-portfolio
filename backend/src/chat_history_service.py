"""
History Service

Stores conversation history.

Currently uses in-memory storage.

Can later be replaced with:
- Redis
- PostgreSQL
- Supabase
"""

from __future__ import annotations

import logging
from collections import defaultdict

logger = logging.getLogger(__name__)


class HistoryService:

    def __init__(self):

        self._sessions = defaultdict(list)

    def get_history(
        self,
        session_id: str,
    ) -> list[dict]:

        return self._sessions[session_id]

    def save_message(
        self,
        session_id: str,
        role: str,
        content: str,
    ) -> None:

        self._sessions[session_id].append(
            {
                "role": role,
                "content": content,
            }
        )

        logger.info(
            "Saved %s message for session %s",
            role,
            session_id,
        )

    def clear_history(
        self,
        session_id: str,
    ) -> None:

        self._sessions.pop(session_id, None)

        logger.info(
            "Cleared history for session %s",
            session_id,
        )


_history_service = None


def get_history_service():

    global _history_service

    if _history_service is None:
        _history_service = HistoryService()

    return _history_service