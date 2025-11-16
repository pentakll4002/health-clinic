"""
Text chunking utilities
"""
from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
import config.setting as config


class TextChunker:
    """Text chunking utility"""
    
    def __init__(
        self,
        chunk_size: int = None,
        chunk_overlap: int = None
    ):
        self.chunk_size = chunk_size or config.CHUNK_SIZE
        self.chunk_overlap = chunk_overlap or config.CHUNK_OVERLAP
        
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""]
        )
    
    def chunk_text(self, text: str) -> List[str]:
        """Split text into chunks"""
        return self.splitter.split_text(text)
    
    def chunk_documents(self, documents: List) -> List:
        """Split documents into chunks"""
        return self.splitter.split_documents(documents)


