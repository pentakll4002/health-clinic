"""
RAG (Retrieval-Augmented Generation) implementation
"""
from typing import List, Dict, Optional
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from llm.client import get_llm_client
import config.setting as config


class RAGPipeline:
    """RAG Pipeline for enhanced question answering"""
    
    def __init__(self, vector_store, model_type: Optional[str] = None):
        self.vector_store = vector_store
        self.model_type = model_type
        self._llm_client = None
        self.system_prompt = self._create_system_prompt()
    
    @property
    def llm_client(self):
        """Lazy initialization of LLM client"""
        if self._llm_client is None:
            self._llm_client = get_llm_client(self.model_type)
        return self._llm_client
    
    def _create_system_prompt(self) -> str:
        """Create system prompt for RAG"""
        return """You are a helpful AI assistant. Use the following context information to answer the user's question.
If the context doesn't contain enough information to answer the question, say so and provide a general answer based on your knowledge.

Context:
{context}

Instructions:
- Answer based on the provided context when possible
- Be concise and accurate
- If context is insufficient, acknowledge it and provide a helpful general answer
- Use markdown formatting for better readability
"""
    
    def retrieve(self, query: str, top_k: int = None) -> List[Document]:
        """Retrieve relevant documents from vector store"""
        top_k = top_k or config.TOP_K_RESULTS
        retriever = self.vector_store.as_retriever(
            search_kwargs={"k": top_k}
        )
        return retriever.get_relevant_documents(query)
    
    def format_context(self, documents: List[Document]) -> str:
        """Format retrieved documents as context"""
        if not documents:
            return "No relevant context found."
        
        context_parts = []
        for i, doc in enumerate(documents, 1):
            content = doc.page_content
            metadata = doc.metadata
            source = metadata.get("source", "Unknown")
            context_parts.append(f"[{i}] {content}\nSource: {source}")
        
        return "\n\n".join(context_parts)
    
    def generate_answer(
        self,
        query: str,
        context: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """Generate answer using RAG"""
        prompt = self.system_prompt.format(context=context)
        
        messages = []
        if conversation_history:
            for msg in conversation_history[-5:]:  # Keep last 5 messages
                if msg["role"] == "user":
                    messages.append({"role": "user", "content": msg["content"]})
                elif msg["role"] == "assistant":
                    messages.append({"role": "assistant", "content": msg["content"]})
        
        messages.append({"role": "user", "content": query})
        
        return self.llm_client.chat(
            user_message=query,
            conversation_history=messages,
            system_prompt=prompt
        )
    
    def stream_answer(
        self,
        query: str,
        context: str,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ):
        """Stream answer using RAG"""
        prompt = self.system_prompt.format(context=context)
        
        messages = []
        if conversation_history:
            for msg in conversation_history[-5:]:  # Keep last 5 messages
                if msg["role"] == "user":
                    messages.append({"role": "user", "content": msg["content"]})
                elif msg["role"] == "assistant":
                    messages.append({"role": "assistant", "content": msg["content"]})
        
        messages.append({"role": "user", "content": query})
        
        return self.llm_client.stream_chat(
            user_message=query,
            conversation_history=messages,
            system_prompt=prompt
        )
    
    def query(
        self,
        query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        top_k: int = None
    ) -> Dict[str, any]:
        """Complete RAG query pipeline"""
        # Retrieve relevant documents
        documents = self.retrieve(query, top_k)
        
        # Format context
        context = self.format_context(documents)
        
        # Generate answer
        answer = self.generate_answer(query, context, conversation_history)
        
        return {
            "answer": answer,
            "context": context,
            "sources": [doc.metadata.get("source", "Unknown") for doc in documents],
            "num_sources": len(documents)
        }
    
    def stream_query(
        self,
        query: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        top_k: int = None
    ):
        """Stream RAG query pipeline"""
        # Retrieve relevant documents
        documents = self.retrieve(query, top_k)
        
        # Format context
        context = self.format_context(documents)
        
        # Stream answer
        for chunk in self.stream_answer(query, context, conversation_history):
            yield chunk














