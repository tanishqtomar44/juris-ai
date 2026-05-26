# ============================================================
#  Juris.AI — FastAPI Backend Entry Point
# ============================================================
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from routers import analyze, summarize, translate, predict, calendar

app = FastAPI(
    title="Juris.AI API",
    description="Multi-Agent RAG Legal Intelligence Platform",
    version="1.0.0",
)

# ── CORS (allow Next.js frontend locally + deployed) ─────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(analyze.router,   prefix="/api/analyze",   tags=["Analysis"])
app.include_router(summarize.router, prefix="/api/summarize", tags=["Summarization"])
app.include_router(translate.router, prefix="/api/translate", tags=["Translation"])
app.include_router(predict.router,   prefix="/api/predict",   tags=["Prediction"])
app.include_router(calendar.router,  prefix="/api/calendar",  tags=["Calendar"])

@app.get("/")
async def root():
    return {"status": "Juris.AI API is running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
