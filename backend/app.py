from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.api_impl import router
from src.logger import setup_logging

setup_logging()

app = FastAPI(
    title="Uttara AI",
    version="2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    router,
    prefix="/api",
)

@app.get("/")
def root():

    return {
        "status": "running",
        "service": "Uttara AI"
    }
