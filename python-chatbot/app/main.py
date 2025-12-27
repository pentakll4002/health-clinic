from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import chat
# Upload router is optional - import only if needed
try:
    from api import upload
    upload_available = True
except Exception as e:
    print(f"Warning: Upload router not available: {e}")
    upload_available = False
import config.setting as config

app = FastAPI(
    title="Health Clinic Chatbot API",
    description="Chatbot API with Groq/Llama3, OpenAI/GPT and OSS-20B support",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"  # Allow all for development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(chat.router)
if upload_available:
    app.include_router(upload.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Health Clinic Chatbot API",
        "model_type": config.MODEL_TYPE,
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    try:
        # Test if LLM can be initialized
        from llm.client import get_llm_client
        try:
            client = get_llm_client()
            return {
                "status": "healthy",
                "model_type": config.MODEL_TYPE,
                "llm_configured": True
            }
        except (ValueError, ImportError) as e:
            return {
                "status": "healthy",
                "model_type": config.MODEL_TYPE,
                "llm_configured": False,
                "error": str(e)
            }
    except Exception as e:
        return {
            "status": "healthy",
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=True
    )














