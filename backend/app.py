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

app.include_router(router, prefix="/api")
log.info("running successfully...")
