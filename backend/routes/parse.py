from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.llm_service import LLMService

parserouter = APIRouter()

@parserouter.post("/api/parse")
async def parse(payload: dict):
    raw_text = payload.get("raw_text")

    if not raw_text or not isinstance(raw_text, str):
        return JSONResponse(
            status_code=400,
            content={"error": "No valid text provided"}
        )

    try:
        print("called")
        result = LLMService.extract_mcqs(raw_text)
        print("result:", result)
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
