# ============================================================
#  Juris.AI — API Routers (analyze / summarize / translate /
#              predict / calendar) old code of routers int.py
# ============================================================
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import uuid, os

from agents.agents import (
    client_intake, legal_research_assistant, statutory_interpreter,
    case_law_analyzer, contract_analyzer, legal_risk_assessor,
    compliance_checker, litigation_probability_assessor,
    case_strategy_advisor, legal_document_formatter, dual_output_generator
)
from rag.pipeline import extract_text_from_bytes, ingest_text, retrieve

# ────────────────────────────────────────────────────────────
#  Helper: process uploaded file
# ────────────────────────────────────────────────────────────
async def read_upload(file: UploadFile) -> str:
    raw = await file.read()
    return extract_text_from_bytes(raw, file.filename)


# ════════════════════════════════════════════════════════════
#  /api/analyze
# ════════════════════════════════════════════════════════════
router_analyze = APIRouter()

@router_analyze.post("/")
async def analyze_document(file: UploadFile = File(...)):
    try:
        text = await read_upload(file)
        doc_id = str(uuid.uuid4())
        ingest_text(text, doc_id, {"type": "user_upload", "filename": file.filename})
        retrieved = retrieve("contract analysis risks obligations compliance", n_results=5)
        context = "\n".join(retrieved)

        intake   = client_intake(text)
        contract = contract_analyzer(text)
        risk     = legal_risk_assessor(text, contract["contract_analysis"])
        comply   = compliance_checker(text, intake["intake_analysis"])
        combined = f"{contract['contract_analysis']}\n\n{risk['risk_assessment']}\n\n{comply['compliance_report']}"
        formatted = legal_document_formatter(combined, "contract analysis")
        layman   = dual_output_generator(formatted["formatted_output"])

        return JSONResponse({
            "status": "success",
            "intake": intake["intake_analysis"],
            "professional": formatted["formatted_output"],
            "layman": layman["layman_output"],
            "risk_assessment": risk["risk_assessment"],
            "compliance": comply["compliance_report"],
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

router = router_analyze


# ════════════════════════════════════════════════════════════
#  /api/summarize
# ════════════════════════════════════════════════════════════
router_summarize = APIRouter()

@router_summarize.post("/")
async def summarize_document(file: UploadFile = File(...)):
    try:
        text = await read_upload(file)
        doc_id = str(uuid.uuid4())
        ingest_text(text, doc_id, {"type": "user_upload", "filename": file.filename})

        intake   = client_intake(text)
        summary  = legal_research_assistant(text, intake["intake_analysis"])
        interp   = statutory_interpreter(text)
        cases    = case_law_analyzer(text)
        combined = f"{summary['summary']}\n\n{interp['legal_translation']}\n\n{cases['case_analysis']}"
        formatted = legal_document_formatter(combined, "legal summary")
        layman   = dual_output_generator(formatted["formatted_output"])

        return JSONResponse({
            "status": "success",
            "intake": intake["intake_analysis"],
            "professional": formatted["formatted_output"],
            "layman": layman["layman_output"],
            "case_analysis": cases["case_analysis"],
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

router_sum = router_summarize


# ════════════════════════════════════════════════════════════
#  /api/translate
# ════════════════════════════════════════════════════════════
router_translate = APIRouter()

@router_translate.post("/")
async def translate_document(
    file: UploadFile = File(...),
    target_language: str = Form("Hindi"),
):
    try:
        text = await read_upload(file)
        intake  = client_intake(text)
        legal_t = statutory_interpreter(text, target_language)
        plain_t = legal_research_assistant(
            f"Rewrite the following in simple everyday {target_language} for a non-lawyer:\n\n{legal_t['legal_translation']}",
            intake["intake_analysis"]
        )
        return JSONResponse({
            "status": "success",
            "intake": intake["intake_analysis"],
            "professional": legal_t["legal_translation"],
            "layman": plain_t["summary"],
            "target_language": target_language,
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

router_trans = router_translate


# ════════════════════════════════════════════════════════════
#  /api/predict
# ════════════════════════════════════════════════════════════
router_predict = APIRouter()

@router_predict.post("/")
async def predict_outcome(file: UploadFile = File(...)):
    try:
        text = await read_upload(file)
        doc_id = str(uuid.uuid4())
        ingest_text(text, doc_id, {"type": "user_upload", "filename": file.filename})

        intake   = client_intake(text)
        cases    = case_law_analyzer(text)
        risk     = legal_risk_assessor(text)
        pred     = litigation_probability_assessor(text, cases["case_analysis"], risk["risk_assessment"])
        strategy = case_strategy_advisor(text, pred["prediction"])
        combined = f"{pred['prediction']}\n\n{strategy['strategy']}"
        formatted = legal_document_formatter(combined, "litigation assessment")
        layman   = dual_output_generator(formatted["formatted_output"])

        return JSONResponse({
            "status": "success",
            "intake": intake["intake_analysis"],
            "professional": formatted["formatted_output"],
            "layman": layman["layman_output"],
            "prediction": pred["prediction"],
            "strategy": strategy["strategy"],
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

router_pred = router_predict


# ════════════════════════════════════════════════════════════
#  /api/calendar
# ════════════════════════════════════════════════════════════
router_calendar = APIRouter()

@router_calendar.get("/events")
async def get_events():
    """Return upcoming legal deadlines from Google Calendar."""
    try:
        from calendar.legal_clock import get_upcoming_events
        events = get_upcoming_events()
        return JSONResponse({"status": "success", "events": events})
    except Exception as e:
        # Return mock data if calendar not configured
        return JSONResponse({"status": "mock", "events": [
            {"summary": "Filing Deadline — Sample Case", "start": "2025-08-15", "description": "Submit petition to Delhi High Court"},
            {"summary": "Hearing Date — Contract Dispute", "start": "2025-08-22", "description": "Commercial Court, Delhi"},
        ]})

router_cal = router_calendar
