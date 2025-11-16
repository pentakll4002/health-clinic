# Health Clinic Chatbot

Chatbot system with support for OpenAI/GPT and OSS-20B models, featuring RAG (Retrieval-Augmented Generation) capabilities.

## Features

- 🤖 Support for OpenAI/GPT and OSS-20B models
- 📚 RAG (Retrieval-Augmented Generation) for enhanced responses
- 🔍 Vector store support (ChromaDB and FAISS)
- 📄 Document ingestion (PDF, TXT, CSV, Markdown)
- 🌐 FastAPI REST API
- 💬 Streamlit web interface
- 🔄 Streaming responses

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Configure your `.env` file with API keys and settings.

## Configuration

### For OpenAI/GPT:
```env
MODEL_TYPE=openai
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### For OSS-20B:
```env
MODEL_TYPE=oss-20b
OSS_20B_BASE_URL=http://localhost:8000/v1
OSS_20B_MODEL=gpt-oss-20b
```

## Usage

### Run FastAPI Server:
```bash
python -m app.main
# or
uvicorn app.main:app --reload
```

### Run Streamlit Interface:
```bash
streamlit run app/streamlit_app.py
```

### Upload Documents:
Use the `/api/upload/documents` endpoint to upload and process documents.

### Chat:
Use the `/api/chat/` endpoint for chat functionality, or use the Streamlit interface.

## API Endpoints

- `POST /api/chat/` - Chat with the bot
- `POST /api/chat/stream` - Stream chat responses
- `POST /api/upload/documents` - Upload documents
- `POST /api/upload/text` - Upload plain text

## Project Structure

```
python-chatbot/
├── app/              # Main application
├── api/              # API endpoints
├── config/           # Configuration
├── ingestion/        # Document ingestion
├── llm/              # LLM clients and RAG
├── utils/            # Utilities
├── vectorstore/      # Vector store management
└── data/             # Data storage
```

## License

MIT



