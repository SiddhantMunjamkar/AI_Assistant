import os
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings

# === Paths ===
current_dir = os.path.dirname(os.path.abspath(__file__))
prompt_txt_path = os.path.join(current_dir, "prompt", "prompt.txt")
chroma_db_dir = os.path.join(current_dir, "prompt", "chroma_db_with_metadata")

# === Debug print ===
print(f"Loading prompt from: {prompt_txt_path}")
print(f"Saving vector DB to: {chroma_db_dir}")

# === Check if chroma DB already exists ===
if os.path.exists(chroma_db_dir):
    print("✅ Vector store already exists. Skipping embedding step.")
else:
    # === Load and split prompt.txt ===
    if not os.path.exists(prompt_txt_path):
        raise FileNotFoundError("❌ prompt.txt not found in 'prompt/' folder.")

    loader = TextLoader(prompt_txt_path)
    docs = loader.load()

    # Optional: Add metadata
    for doc in docs:
        doc.metadata = {"source": "prompt.txt"}

    # === Chunk the document ===
    splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)
    print(f"📄 Split into {len(chunks)} chunks.")

    # === Generate embeddings with Ollama ===
    embeddings = OllamaEmbeddings(
        model="llama3:8b",
        base_url="http://localhost:11434"
    )

    # === Create and persist vector DB ===
    db = Chroma.from_documents(
        chunks,
        embedding=embeddings,
        persist_directory=chroma_db_dir
    )
    print("✅ Chroma DB created and saved.")
