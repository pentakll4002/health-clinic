"""
LLM Client for Groq/Llama3, OpenAI/GPT and OSS-20B models
"""
from typing import List, Dict, Optional
try:
    from langchain_groq import ChatGroq
except ImportError:
    ChatGroq = None
try:
    from langchain_openai import ChatOpenAI
except ImportError:
    ChatOpenAI = None
from langchain_community.llms import Ollama
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
# Callbacks are optional and not used in current implementation
# from langchain.callbacks.manager import CallbackManager
# from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
import config.setting as config


class LLMClient:
    """Unified LLM client supporting Groq/Llama3, OpenAI and OSS-20B"""
    
    def __init__(self, model_type: Optional[str] = None):
        self.model_type = model_type or config.MODEL_TYPE
        self.llm = self._initialize_llm()
    
    def _initialize_llm(self):
        """Initialize the LLM based on model type"""
        if self.model_type == "groq":
            return self._init_groq()
        elif self.model_type == "openai":
            return self._init_openai()
        elif self.model_type == "oss-20b":
            return self._init_oss_20b()
        else:
            raise ValueError(f"Unsupported model type: {self.model_type}")
    
    def _init_groq(self):
        """Initialize Groq/Llama3 model (Default - Free tier available)"""
        if ChatGroq is None:
            raise ImportError("langchain_groq is not installed. Run: pip install langchain_groq")
        
        if not config.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is required for Groq model. Get free API key at https://console.groq.com/")
        
        return ChatGroq(
            model=config.GROQ_MODEL,
            groq_api_key=config.GROQ_API_KEY,
            temperature=config.GROQ_TEMPERATURE,
            max_tokens=config.GROQ_MAX_TOKENS,
            streaming=True,
        )
    
    def _init_openai(self):
        """Initialize OpenAI/GPT model"""
        if ChatOpenAI is None:
            raise ImportError("langchain_openai is not installed. Run: pip install langchain_openai")
        
        if not config.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required for OpenAI model")
        
        return ChatOpenAI(
            model=config.OPENAI_MODEL,
            api_key=config.OPENAI_API_KEY,
            base_url=config.OPENAI_BASE_URL,
            temperature=config.OPENAI_TEMPERATURE,
            max_tokens=config.OPENAI_MAX_TOKENS,
            streaming=True,
        )
    
    def _init_oss_20b(self):
        """Initialize OSS-20B model (using OpenAI-compatible API)"""
        if ChatOpenAI is None:
            raise ImportError("langchain_openai is not installed. Run: pip install langchain_openai")
        
        return ChatOpenAI(
            model=config.OSS_20B_MODEL,
            api_key=config.OSS_20B_API_KEY,
            base_url=config.OSS_20B_BASE_URL,
            temperature=config.OSS_20B_TEMPERATURE,
            max_tokens=config.OSS_20B_MAX_TOKENS,
            streaming=True,
        )
    
    def generate(
        self,
        messages: List[BaseMessage],
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> str:
        """Generate response from LLM"""
        if system_prompt:
            messages = [SystemMessage(content=system_prompt)] + messages
        
        response = self.llm.invoke(messages)
        return response.content
    
    def stream_generate(
        self,
        messages: List[BaseMessage],
        system_prompt: Optional[str] = None,
        **kwargs
    ):
        """Stream response from LLM"""
        if system_prompt:
            messages = [SystemMessage(content=system_prompt)] + messages
        
        for chunk in self.llm.stream(messages):
            if hasattr(chunk, 'content'):
                yield chunk.content
            else:
                yield str(chunk)
    
    def chat(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> str:
        """Chat with the LLM"""
        messages = []
        
        if conversation_history:
            for msg in conversation_history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))
        
        messages.append(HumanMessage(content=user_message))
        
        return self.generate(messages, system_prompt, **kwargs)
    
    def stream_chat(
        self,
        user_message: str,
        conversation_history: Optional[List[Dict[str, str]]] = None,
        system_prompt: Optional[str] = None,
        **kwargs
    ):
        """Stream chat with the LLM"""
        messages = []
        
        if conversation_history:
            for msg in conversation_history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))
        
        messages.append(HumanMessage(content=user_message))
        
        return self.stream_generate(messages, system_prompt, **kwargs)


def get_llm_client(model_type: Optional[str] = None) -> LLMClient:
    """Factory function to get LLM client"""
    return LLMClient(model_type)













