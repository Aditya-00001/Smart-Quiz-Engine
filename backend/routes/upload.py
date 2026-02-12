from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from pathlib import Path
from io import BytesIO
import pdfplumber as pp
from docx import Document
from services.ocr_service import OCRService

router = APIRouter()

@router.post("/api/upload")
async def uploadFile(file: UploadFile = File(...)):
    MAX_SIZE = 10 * 1024 * 1024  # 10MB
    print("Received")
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        return JSONResponse(status_code=400, content={"error": "File too large"})

    extension = Path(file.filename).suffix.lower()

    if extension not in [".jpg", ".jpeg", ".png", ".pdf", ".docx"]:
        return JSONResponse(status_code=400, content={"error": "Unsupported file type"})
    print("Processing")
    file_stream = BytesIO(contents)
    text = ""

    try:
        if extension == ".pdf":
            with pp.open(file_stream) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"

        elif extension == ".docx":
            doc = Document(file_stream)
            for para in doc.paragraphs:
                text += para.text + "\n"

        elif extension in [".jpg", ".jpeg", ".png"]:
            text = OCRService.extract_text_from_image(file_stream)
            print(text)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

    if not text.strip():
        return JSONResponse(status_code=400, content={"error": "No text extracted"})

    text = " ".join(text.split())
    print("Done")
    return JSONResponse(content={
        "filename": file.filename,
        "extracted_text": text
    })

