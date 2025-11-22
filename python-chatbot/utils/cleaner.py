"""
Text cleaning utilities
"""
import re
from typing import List


class TextCleaner:
    """Text cleaning utility"""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean text by removing extra whitespace and special characters"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters (keep alphanumeric, punctuation, and common symbols)
        text = re.sub(r'[^\w\s.,!?;:()\[\]{}\'"-]', '', text)
        
        # Strip leading/trailing whitespace
        text = text.strip()
        
        return text
    
    @staticmethod
    def clean_documents(documents: List) -> List:
        """Clean a list of documents"""
        cleaned = []
        for doc in documents:
            if hasattr(doc, 'page_content'):
                doc.page_content = TextCleaner.clean_text(doc.page_content)
            cleaned.append(doc)
        return cleaned














