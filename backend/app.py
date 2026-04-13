from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.api_impl import router
import logging

logger = logging.getLogger(__name__)
app = FastAPI(title="Uttara : Answering your questions Smartly")

# Allow frontend dev server (Vite on 5173) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://localhost:4173",   # Vite preview
        "https://preetihegde-portfolio.pages.dev",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],           # Allows x-session-id header
)

app.include_router(router, prefix="/api")