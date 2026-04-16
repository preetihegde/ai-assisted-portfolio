import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Uttara : Answering your questions Smartly")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tightened: allow all for now, restrict post-deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check at root level — Render scans for this
@app.get("/health")
def health():
    return {"status": "ok"}

# Import router AFTER app is created — avoids module-level crash
# if any env var is missing at import time
try:
    from api.api_impl import router
    app.include_router(router, prefix="/api")
    logger.info("✅ Router loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load router: {e}")
    raise  # Re-raise so Render shows the actual error in logs

@app.on_event("startup")
async def startup():
    logger.info("✅ Uttara API started and ready")
