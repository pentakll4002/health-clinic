"""
Document ingestion pipeline
"""
from typing import List, Dict, Optional
from langchain.schema import Document
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    CSVLoader,
    UnstructuredMarkdownLoader
)
from utils.chunker import TextChunker
from utils.cleaner import TextCleaner
from vectorstore.create import VectorStoreManager
import os
import config.setting as config


class DocumentIngester:
    """Document ingestion and processing"""
    
    def __init__(self):
        self.chunker = TextChunker()
        self.cleaner = TextCleaner()
        self.vector_store_manager = VectorStoreManager()
    
    def load_document(self, file_path: str) -> List[Document]:
        """Load document based on file type"""
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext == '.pdf':
            loader = PyPDFLoader(file_path)
        elif file_ext == '.txt':
            loader = TextLoader(file_path, encoding='utf-8')
        elif file_ext == '.csv':
            loader = CSVLoader(file_path)
        elif file_ext in ['.md', '.markdown']:
            loader = UnstructuredMarkdownLoader(file_path)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
        
        return loader.load()
    
    def process_documents(
        self,
        documents: List[Document],
        metadata: Optional[Dict] = None
    ) -> List[Document]:
        """Process documents: clean and chunk"""
        # Add metadata if provided
        if metadata:
            for doc in documents:
                doc.metadata.update(metadata)
        
        # Clean documents
        documents = self.cleaner.clean_documents(documents)
        
        # Chunk documents
        chunks = self.chunker.chunk_documents(documents)
        
        return chunks
    
    def ingest_file(
        self,
        file_path: str,
        metadata: Optional[Dict] = None
    ) -> Dict:
        """Ingest a file into the vector store"""
        # Load document
        documents = self.load_document(file_path)
        
        # Add source metadata
        if metadata is None:
            metadata = {}
        metadata['source'] = file_path
        
        # Process documents
        chunks = self.process_documents(documents, metadata)
        
        # Add to vector store
        vector_store = self.vector_store_manager.create_from_documents(chunks)
        
        return {
            "num_chunks": len(chunks),
            "vector_store": vector_store
        }
    
    def ingest_text(
        self,
        text: str,
        metadata: Optional[Dict] = None
    ) -> Dict:
        """Ingest plain text into the vector store"""
        # Create document from text
        doc = Document(page_content=text, metadata=metadata or {})
        
        # Process document
        chunks = self.process_documents([doc])
        
        # Add to vector store
        vector_store = self.vector_store_manager.create_from_documents(chunks)
        
        return {
            "num_chunks": len(chunks),
            "vector_store": vector_store
        }
    
    def ingest_directory(
        self,
        directory_path: str,
        metadata: Optional[Dict] = None
    ) -> Dict:
        """Ingest all documents in a directory"""
        all_chunks = []
        
        for filename in os.listdir(directory_path):
            file_path = os.path.join(directory_path, filename)
            
            if os.path.isfile(file_path):
                try:
                    documents = self.load_document(file_path)
                    file_metadata = metadata.copy() if metadata else {}
                    file_metadata['source'] = file_path
                    
                    chunks = self.process_documents(documents, file_metadata)
                    all_chunks.extend(chunks)
                except Exception as e:
                    print(f"Error processing {filename}: {e}")
        
        # Add all chunks to vector store
        if all_chunks:
            vector_store = self.vector_store_manager.create_from_documents(all_chunks)
            return {
                "num_chunks": len(all_chunks),
                "vector_store": vector_store
            }
        
        return {"num_chunks": 0}









