"""
Vector store creation and management
Supports ChromaDB and FAISS
"""
from typing import List
from langchain.schema import Document
from langchain_community.vectorstores import Chroma, FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import config.setting as config
import os


class VectorStoreManager:
    """Manage vector store creation and operations"""
    
    def __init__(self):
        self.embeddings = self._init_embeddings()
        self.vector_store = None
    
    def _init_embeddings(self):
        """Initialize embedding model"""
        return HuggingFaceEmbeddings(
            model_name=config.EMBEDDING_MODEL,
            model_kwargs={'device': config.EMBEDDING_DEVICE}
        )
    
    def create_from_documents(
        self,
        documents: List[Document],
        store_type: str = None
    ):
        """Create vector store from documents"""
        store_type = store_type or config.VECTOR_STORE_TYPE
        
        if store_type == "chroma":
            return self._create_chroma(documents)
        elif store_type == "faiss":
            return self._create_faiss(documents)
        else:
            raise ValueError(f"Unsupported vector store type: {store_type}")
    
    def _create_chroma(self, documents: List[Document]):
        """Create ChromaDB vector store"""
        os.makedirs(config.CHROMA_PERSIST_DIR, exist_ok=True)
        
        vector_store = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=config.CHROMA_PERSIST_DIR
        )
        
        vector_store.persist()
        return vector_store
    
    def _create_faiss(self, documents: List[Document]):
        """Create FAISS vector store"""
        os.makedirs(os.path.dirname(config.FAISS_INDEX_PATH), exist_ok=True)
        
        vector_store = FAISS.from_documents(
            documents=documents,
            embedding=self.embeddings
        )
        
        vector_store.save_local(config.FAISS_INDEX_PATH)
        return vector_store
    
    def load_vector_store(self, store_type: str = None):
        """Load existing vector store"""
        store_type = store_type or config.VECTOR_STORE_TYPE
        
        if store_type == "chroma":
            return self._load_chroma()
        elif store_type == "faiss":
            return self._load_faiss()
        else:
            raise ValueError(f"Unsupported vector store type: {store_type}")
    
    def _load_chroma(self):
        """Load ChromaDB vector store"""
        if not os.path.exists(config.CHROMA_PERSIST_DIR):
            return None
        
        return Chroma(
            persist_directory=config.CHROMA_PERSIST_DIR,
            embedding_function=self.embeddings
        )
    
    def _load_faiss(self):
        """Load FAISS vector store"""
        if not os.path.exists(config.FAISS_INDEX_PATH):
            return None
        
        return FAISS.load_local(
            config.FAISS_INDEX_PATH,
            self.embeddings,
            allow_dangerous_deserialization=True
        )


def get_vector_store(store_type: str = None):
    """Get or create vector store"""
    manager = VectorStoreManager()
    vector_store = manager.load_vector_store(store_type)
    
    if vector_store is None:
        # Return empty vector store that can be populated
        return manager
    
    return vector_store








