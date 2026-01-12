from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.upload import router as uploadRouter
from routes.parse import parserouter as parseRouter

app = FastAPI()

# 🔥 THIS IS THE FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(uploadRouter, tags=["Upload"])
app.include_router(parseRouter, tags=["Parse"])

@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
