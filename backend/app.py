 import logging
# from contextlib import asynccontextmanager

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# #from src.rest_service import get_embeddings, get_vector_store
import os
from dotenv import load_dotenv

 load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# @asynccontextmanager
# async def lifespan(app: FastAPI):

#     logger.info("start up..........")
#     logger.info("🔥 Loading embeddings...")
#     #get_embeddings()

#     logger.info("🔥 Loading vector store...")
#     #get_vector_store()

#     logger.info("✅ Uttara ready")

#     yield

#     logger.info("🛑 Uttara shutting down")


# app = FastAPI(
#     title="Uttara : Answering your questions Smartly",
#     lifespan=lifespan
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/health")
# def health():
#     return {"status": "ok"}


# try:
#     from api.api_impl import router

#     app.include_router(router, prefix="/api")
#     logger.info("🔥 THIS IS THE FILE BEING EXECUTED")
#     logger.info("✅ Router loaded successfully")

# except Exception as e:
#     logger.error(f"❌ Failed to load router: {e}")
#     raise
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    logger.info("starting the application..........")
    return {"message": "hello"}
