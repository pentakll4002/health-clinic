"""
Chat API endpoints
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from llm.rag import RAGPipeline
from vectorstore.create import get_vector_store
import config.setting as config

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    use_rag: bool = True
    top_k: Optional[int] = None


class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = None
    num_sources: Optional[int] = None


# Initialize RAG pipeline
_vector_store = None
_rag_pipeline = None


def get_rag_pipeline():
    """Get or initialize RAG pipeline"""
    global _vector_store, _rag_pipeline
    
    if _rag_pipeline is None:
        _vector_store = get_vector_store()
        if _vector_store is None:
            raise HTTPException(
                status_code=500,
                detail="Vector store not initialized. Please upload documents first."
            )
        _rag_pipeline = RAGPipeline(_vector_store, config.MODEL_TYPE)
    
    return _rag_pipeline


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint with optional RAG"""
    try:
        rag_pipeline = get_rag_pipeline()
        
        # Convert conversation history
        history = []
        if request.conversation_history:
            for msg in request.conversation_history:
                history.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        if request.use_rag:
            # Use RAG
            result = rag_pipeline.query(
                query=request.message,
                conversation_history=history,
                top_k=request.top_k
            )
            
            return ChatResponse(
                answer=result["answer"],
                sources=result["sources"],
                num_sources=result["num_sources"]
            )
        else:
            # Direct LLM chat
            from llm.client import get_llm_client
            llm_client = get_llm_client(config.MODEL_TYPE)
            
            answer = llm_client.chat(
                user_message=request.message,
                conversation_history=history
            )
            
            return ChatResponse(
                answer=answer,
                sources=None,
                num_sources=0
            )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """Stream chat endpoint"""
    try:
        rag_pipeline = get_rag_pipeline()
        
        # Convert conversation history
        history = []
        if request.conversation_history:
            for msg in request.conversation_history:
                history.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        if request.use_rag:
            # Stream RAG response
            from fastapi.responses import StreamingResponse
            import json
            
            def generate():
                for chunk in rag_pipeline.stream_query(
                    query=request.message,
                    conversation_history=history,
                    top_k=request.top_k
                ):
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            
            return StreamingResponse(generate(), media_type="text/event-stream")
        else:
            # Stream direct LLM response
            from fastapi.responses import StreamingResponse
            from llm.client import get_llm_client
            import json
            
            llm_client = get_llm_client(config.MODEL_TYPE)
            
            def generate():
                for chunk in llm_client.stream_chat(
                    user_message=request.message,
                    conversation_history=history
                ):
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            
            return StreamingResponse(generate(), media_type="text/event-stream")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))









