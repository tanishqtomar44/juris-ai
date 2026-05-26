from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

CATEGORIES = {
    "summarize":  "Quick Summary",
    "analyze":    "Document Review",
    "predict":    "Case Evaluation",
    "translate":  "Translation",
}

ROUTER_PROMPT = """
You are the Juris.AI Master Router. Classify the user's legal request into exactly one category:
- summarize  → User wants a summary of a legal document or judgment
- analyze    → User wants contract/document analysis or compliance check
- predict    → User wants win/loss probability or case strategy
- translate  → User wants translation to Hindi/English (legal or plain)

Respond with ONLY the category word (summarize / analyze / predict / translate).

User request: {query}
"""

def classify_query(query: str) -> str:
    """Use Gemini to classify the query into a routing category."""
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(ROUTER_PROMPT.format(query=query))
    category = response.text.strip().lower()
    if category not in CATEGORIES:
        return "analyze"  # default fallback
    return category

def get_agent_pipeline(category: str) -> list[str]:
    """Return the ordered list of agents to invoke for a given category."""
    pipelines = {
        "summarize": [
            "client_intake",
            "legal_research_assistant",
            "statutory_interpreter",
            "case_law_analyzer",
            "legal_document_formatter",
            "dual_output",
        ],
        "analyze": [
            "client_intake",
            "contract_analyzer",
            "legal_risk_assessor",
            "compliance_checker",
            "legal_document_formatter",
            "dual_output",
        ],
        "predict": [
            "client_intake",
            "case_law_analyzer",
            "legal_risk_assessor",
            "litigation_probability_assessor",
            "case_strategy_advisor",
            "dual_output",
        ],
        "translate": [
            "client_intake",
            "statutory_interpreter",
            "legal_research_assistant",
            "dual_output",
        ],
    }
    return pipelines.get(category, pipelines["analyze"])
