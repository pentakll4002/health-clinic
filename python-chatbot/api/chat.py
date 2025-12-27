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
    """Get or initialize RAG pipeline (lazy initialization)"""
    global _vector_store, _rag_pipeline
    
    if _rag_pipeline is None:
        _vector_store = get_vector_store()
        # Allow pipeline to be created even without vector store (will use LLM only)
        if _vector_store is None:
            # Create a dummy vector store that allows RAG to work without documents
            from langchain_core.documents import Document
            _vector_store = type('EmptyVectorStore', (), {
                'as_retriever': lambda self, **kwargs: type('EmptyRetriever', (), {
                    'get_relevant_documents': lambda query: []
                })()
            })()
        _rag_pipeline = RAGPipeline(_vector_store, config.MODEL_TYPE)
    
    return _rag_pipeline


@router.post("", response_model=ChatResponse)
@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat endpoint with optional RAG"""
    import traceback
    try:
        # Convert conversation history
        history = []
        if request.conversation_history:
            for msg in request.conversation_history:
                history.append({
                    "role": msg.role,
                    "content": msg.content
                })
        
        # Use RAG if requested and available, otherwise use direct LLM
        if request.use_rag:
            try:
                rag_pipeline = get_rag_pipeline()
                result = rag_pipeline.query(
                    query=request.message,
                    conversation_history=history,
                    top_k=request.top_k
                )
                return ChatResponse(
                    answer=result["answer"],
                    sources=result.get("sources"),
                    num_sources=result.get("num_sources", 0)
                )
            except Exception as e:
                # If RAG fails, fallback to direct LLM
                print(f"RAG failed, falling back to direct LLM: {e}")
        
        # Direct LLM chat (fallback or when use_rag=False)
        from llm.client import get_llm_client
        try:
            llm_client = get_llm_client(config.MODEL_TYPE)
            answer = llm_client.chat(
                user_message=request.message,
                conversation_history=history
            )
        except ValueError as e:
            # API key missing or invalid
            error_detail = str(e)
            print(f"ValueError in chat: {error_detail}")
            raise HTTPException(
                status_code=400,
                detail=f"LLM configuration error: {error_detail}. Please check your API keys in .env file."
            )
        except ImportError as e:
            # Missing dependencies
            error_detail = str(e)
            print(f"ImportError in chat: {error_detail}")
            raise HTTPException(
                status_code=500,
                detail=f"Missing dependencies: {error_detail}. Please install required packages."
            )
        except Exception as e:
            # Other LLM errors
            error_detail = str(e)
            traceback.print_exc()
            print(f"LLM error: {error_detail}")
            raise HTTPException(
                status_code=500,
                detail=f"LLM error: {error_detail}"
            )
        
        return ChatResponse(
            answer=answer,
            sources=None,
            num_sources=0
        )
    
    except HTTPException:
        raise
    except Exception as e:
        error_detail = str(e)
        traceback.print_exc()
        print(f"Unexpected error in chat endpoint: {error_detail}")
        raise HTTPException(
            status_code=500, 
            detail=f"Chat error: {error_detail}. Check server logs for details."
        )


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














