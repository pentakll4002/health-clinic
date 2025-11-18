"""
Streamlit web interface for the chatbot
"""
import streamlit as st
from llm.rag import RAGPipeline
from vectorstore.create import get_vector_store
import config.setting as config

# Page config
st.set_page_config(
    page_title="Health Clinic Chatbot",
    page_icon="💬",
    layout="wide"
)

# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []

if "rag_pipeline" not in st.session_state:
    try:
        vector_store = get_vector_store()
        if vector_store:
            st.session_state.rag_pipeline = RAGPipeline(vector_store, config.MODEL_TYPE)
        else:
            st.session_state.rag_pipeline = None
    except Exception as e:
        st.error(f"Error initializing RAG pipeline: {e}")
        st.session_state.rag_pipeline = None

# Sidebar
with st.sidebar:
    st.title("⚙️ Settings")
    
    model_type = st.selectbox(
        "Model Type",
        ["openai", "oss-20b"],
        index=0 if config.MODEL_TYPE == "openai" else 1
    )
    
    use_rag = st.checkbox("Use RAG", value=True)
    
    top_k = st.slider("Top K Results", 1, 10, config.TOP_K_RESULTS)
    
    if st.button("Clear Chat"):
        st.session_state.messages = []
        st.rerun()

# Main chat interface
st.title("💬 Health Clinic Chatbot")
st.markdown("Chat with AI assistant powered by OpenAI/GPT or OSS-20B")

# Display chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        
        if "sources" in message and message["sources"]:
            with st.expander("📚 Sources"):
                for source in message["sources"]:
                    st.text(source)

# Chat input
if prompt := st.chat_input("Ask a question..."):
    # Add user message
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # Generate response
    with st.chat_message("assistant"):
        if st.session_state.rag_pipeline is None:
            st.error("Vector store not initialized. Please upload documents first.")
        else:
            try:
                # Prepare conversation history
                history = []
                for msg in st.session_state.messages[:-1]:  # Exclude current message
                    history.append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
                
                if use_rag:
                    # Use RAG
                    result = st.session_state.rag_pipeline.query(
                        query=prompt,
                        conversation_history=history,
                        top_k=top_k
                    )
                    
                    response = result["answer"]
                    sources = result["sources"]
                else:
                    # Direct LLM
                    from llm.client import get_llm_client
                    llm_client = get_llm_client(model_type)
                    response = llm_client.chat(
                        user_message=prompt,
                        conversation_history=history
                    )
                    sources = None
                
                # Display response
                st.markdown(response)
                
                # Display sources if available
                if sources:
                    with st.expander("📚 Sources"):
                        for source in sources:
                            st.text(source)
                
                # Add assistant message
                message = {"role": "assistant", "content": response}
                if sources:
                    message["sources"] = sources
                st.session_state.messages.append(message)
            
            except Exception as e:
                st.error(f"Error: {e}")








