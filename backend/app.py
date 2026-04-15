from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.api_impl import router
import logging

logger = logging.getLogger(__name__)
print("🔥 APP FILE LOADED")
app = FastAPI(title="Uttara : Answering your questions Smartly")
print("🔥 APP FILE starting................")
logger.log("App started..")

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
print("🔥 in rpogress.......................")
app.include_router(router, prefix="/api")
print("🔥 APP FILE LOADED successfully")
