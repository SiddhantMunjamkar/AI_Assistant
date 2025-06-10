from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .langchain_chain import get_code_response
import logging

# from chains import generate_code,

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()


# CORs middleware to allow frontend access

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request model
class PromptRequest(BaseModel):
    prompt: str


# Endpoint: /generate
@app.post("/generate")
async def generate_code(request: PromptRequest):
    try:
        logger.info(f"Received prompt: {request.prompt}")
        
        # Get response from LangChain + Ollama
        result = await get_code_response(request.prompt)
        
        logger.info(f"Raw result from LLM: {result}")

        # validate expected structure
        if not isinstance(result, dict):
            logger.error(f"Result is not a dictionary: {type(result)}")
            return {
                "message": f"LLM returned unexpected type: {type(result)}",
                "files": {}
            }
        
        if "message" not in result or "files" not in result:
            logger.error(f"Missing required keys in result: {result.keys()}")
            return {
                "message": "LLM response missing required fields",
                "files": {}
            }
            
        return result
    except Exception as e:
        logger.error(f"Error in generate_code: {str(e)}", exc_info=True)
        return {
            "message": f"Error generating code: {str(e)}",
            "files": {}
        }
