"""
Configuration settings for the chatbot
Supports OpenAI/GPT and OSS-20B models
"""
import os
from dotenv import load_dotenv

load_dotenv()

# Model Configuration
MODEL_TYPE = os.getenv("MODEL_TYPE", "openai")  # "openai" or "oss-20b"

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", "0.7"))
OPENAI_MAX_TOKENS = int(os.getenv("OPENAI_MAX_TOKENS", "2000"))

# OSS-20B Configuration
OSS_20B_BASE_URL = os.getenv("OSS_20B_BASE_URL", "http://localhost:8000/v1")
OSS_20B_API_KEY = os.getenv("OSS_20B_API_KEY", "not-needed")
OSS_20B_MODEL = os.getenv("OSS_20B_MODEL", "gpt-oss-20b")
OSS_20B_TEMPERATURE = float(os.getenv("OSS_20B_TEMPERATURE", "0.7"))
OSS_20B_MAX_TOKENS = int(os.getenv("OSS_20B_MAX_TOKENS", "2000"))

# Vector Store Configuration
VECTOR_STORE_TYPE = os.getenv("VECTOR_STORE_TYPE", "chroma")  # "chroma" or "faiss"
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./vectorstore/chromadb")
FAISS_INDEX_PATH = os.getenv("FAISS_INDEX_PATH", "./vectorstore/faiss_index")

# Embedding Configuration
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
EMBEDDING_DEVICE = os.getenv("EMBEDDING_DEVICE", "cpu")

# RAG Configuration
TOP_K_RESULTS = int(os.getenv("TOP_K_RESULTS", "5"))
SIMILARITY_THRESHOLD = float(os.getenv("SIMILARITY_THRESHOLD", "0.7"))

# Data Configuration
DATA_RAW_DIR = "./data/raw"
DATA_PROCESSED_DIR = "./data/processed"

# Chunking Configuration
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "1000"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))

# API Configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

# Streamlit Configuration
STREAMLIT_PORT = int(os.getenv("STREAMLIT_PORT", "8501"))


