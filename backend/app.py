import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this later
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Health check — Render pings this to confirm the app is alive ──
@app.get("/health")
def health():
    return {"status": "ok"}

# ── Your existing routes below ──
# @app.post("/api/chat")
# ...

# ── Startup log — tells you the app actually initialised ──
@app.on_event("startup")
async def startup():
    logger.info("✅ Uttara API started successfully")