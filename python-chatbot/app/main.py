from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import chat, upload
import config.setting as config

app = FastAPI(
    title="Health Clinic Chatbot API",
    description="Chatbot API with OpenAI/GPT and OSS-20B support",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)
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
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=config.API_HOST,
        port=config.API_PORT,
        reload=True
    )


