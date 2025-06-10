import os
import re
from typing import List, Dict, Optional
from dotenv import load_dotenv

from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.vectorstores import Chroma
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.chat_models import ChatOllama

# === Load .env ===
load_dotenv()

# === Paths ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "prompt", "chroma_db_with_metadata")

# === Debug print ===
print(f"Looking for Chroma DB in: {DB_DIR}")

# === Embeddings and Vector DB ===
embedding_model = OllamaEmbeddings(model="llama3:8b", base_url="http://localhost:11434")
vectorstore = Chroma(persist_directory=DB_DIR, embedding_function=embedding_model)

retriever = vectorstore.as_retriever(
    search_type="mmr",  # Better for diverse code chunks
    search_kwargs={"k": 6, "lambda_mult": 0.7}
)

# === LLM Setup ===
llm = ChatOllama(
    model="llama3:8b",
    base_url="http://localhost:11434",
    temperature=0.7
)

# === Prompt Templates ===

# Reformulate prompt to be standalone
contextualize_q_prompt = ChatPromptTemplate.from_messages([
    ("system", "Given a chat history and the latest user question "
               "which might reference context in the chat history, "
               "formulate a standalone question which can be understood "
               "without the chat history. Do NOT answer the question, just "
               "reformulate it if needed and otherwise return it as is."),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}")
])

# Main conversation prompt
qa_system_prompt = """You are a helpful AI assistant that can engage in general conversation and generate code when needed.

For code-related questions or when code generation is explicitly requested:
- Return code in markdown blocks using this format: ```javascript:title=filepath\ncode```
- Example: ```javascript:title=src/components/Todo.js\nconst Todo = () => {{ return null; }}```
- Generate idiomatic, production-grade code with:
  * Modern React practices (hooks, functional components)
  * TypeScript when appropriate
  * Consistent styling approach (either all Tailwind classes or all CSS modules, don't mix)
  * Complete CRUD operations
  * Error handling and loading states
  * Responsive design
  * Accessibility features
  * Clear comments and documentation
  * Proper project setup (package.json, README.md, etc.)
- Include ALL necessary files (components, styles, configs)
- When using Tailwind:
  * Include tailwind.config.js
  * Show proper installation steps
  * Use consistent class naming
- Don't explain the code unless asked

For general conversation:
- Provide direct, natural responses
- Don't generate code unless specifically asked
- Be friendly and helpful"""

qa_prompt = ChatPromptTemplate.from_messages([
    ("system", qa_system_prompt),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "Context: {context}\nQuestion: {input}")
])

# === Retrieval-Augmented Generation Setup ===
history_aware_retriever = create_history_aware_retriever(
    llm=llm,
    retriever=retriever,
    prompt=contextualize_q_prompt
)

doc_chain = create_stuff_documents_chain(llm=llm, prompt=qa_prompt)
rag_chain = create_retrieval_chain(history_aware_retriever, doc_chain)

# === Default system message ===
default_system_message = SystemMessage(content=qa_system_prompt)


# === Extract code files from markdown ===
def extract_files_from_output(text: str) -> Dict[str, str]:
    """
    Extract files from markdown-formatted LLM output.
    Handles multiple code block formats:
    1. ```language:title=filepath\ncode```
    2. ```javascript\n// filename: filepath\ncode```
    3. **filepath**\n```language\ncode```
    """
    files = {}
    
    # Pattern 1: ```language:title=filepath\ncode```
    pattern1 = r"```[a-zA-Z0-9]*:title=([^`\n]+?)\n(.*?)```"
    matches1 = re.findall(pattern1, text, re.DOTALL)
    for filepath, content in matches1:
        files[filepath.strip()] = content.strip()
    
    # Pattern 2: Named code blocks with filename in comment
    pattern2 = r"```[a-zA-Z0-9]+\n//\s*filename:\s*([^\n]+)\n(.*?)```"
    matches2 = re.findall(pattern2, text, re.DOTALL)
    for filepath, content in matches2:
        files[filepath.strip()] = content.strip()
    
    # Pattern 3: **filepath** followed by code block
    pattern3 = r"\*\*([^*\n]+?)\*\*\n```[a-zA-Z0-9]*\n(.*?)```"
    matches3 = re.findall(pattern3, text, re.DOTALL)
    for filepath, content in matches3:
        files[filepath.strip()] = content.strip()
    
    # Pattern 4: Simple filename.ext code blocks
    pattern4 = r"\*\*([^*\n]+\.(?:js|jsx|ts|tsx|py|css|html|json|md))\*\*\n```[a-zA-Z0-9]*\n(.*?)```"
    matches4 = re.findall(pattern4, text, re.DOTALL)
    for filepath, content in matches4:
        files[filepath.strip()] = content.strip()

    print(f"Extracted files: {list(files.keys())}")  # Debug print
    return files


# === Final RAG-based Code Response Function ===
async def get_code_response(prompt: str, history: Optional[List] = None) -> Dict:
    if history is None:
        history = [default_system_message]

    try:
        print(f"Received prompt: {prompt}")  # Debug print
        
        # Add user's message
        history.append(HumanMessage(content=prompt))

        # Call chain
        result = await rag_chain.ainvoke({
            "input": prompt,
            "chat_history": history
        })

        print(f"Raw chain result: {result}")  # Debug print

        response_text = result["answer"]
        history.append(AIMessage(content=response_text))

        # Extract files
        files = extract_files_from_output(response_text)
        
        print(f"Extracted files: {files}")  # Debug print

        return {
            "message": response_text,
            "files": files
        }

    except Exception as e:
        print(f"Error in get_code_response: {str(e)}")  # Debug print
        return {
            "message": f"Error: {str(e)}",
            "files": {}
        }
