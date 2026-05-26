from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def _call(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000,
    )
    return response.choices[0].message.content.strip()


#Client Intake Analyzer
def client_intake(text: str) -> dict:
    prompt = f"""You are the Client Intake Analyzer for Juris.AI (Indian Law).
Analyze this legal document and return:
1. Document type (contract / judgment / statute / petition / other)
2. Jurisdiction (Central / State — which state)
3. Key parties involved
4. Important dates and deadlines mentioned
5. Primary legal issues

Document:
{text[:4000]}
"""
    return {"intake_analysis": _call(prompt)}


#Legal Research Assistant (Summarizer)
def legal_research_assistant(text: str, intake: str = "") -> dict:
    prompt = f"""You are the Legal Research Assistant for Juris.AI.
Context from intake: {intake}

Provide a comprehensive legal summary of the following document. Include:
- Core legal issues
- Key arguments presented
- Relevant Indian statutes referenced
- Outcome or implications

Document:
{text[:5000]}
"""
    return {"summary": _call(prompt)}


#Statutory Interpreter 
def statutory_interpreter(text: str, target_language: str = "English") -> dict:
    prompt = f"""You are the Statutory Interpreter for Juris.AI specializing in Indian law.
Translate and interpret the following legal document into formal Legal {target_language}.
- Preserve all legal terminology, section numbers, and citations
- Format: AIR/SCC citation format for Indian law
- Clarify ambiguous statutory language using Indian legal principles

Document:
{text[:5000]}
"""
    return {"legal_translation": _call(prompt)}


#Case Law Analyzer
def case_law_analyzer(text: str) -> dict:
    prompt = f"""You are the Case Law Analyzer for Juris.AI (Indian jurisdiction).
Analyze the following document and identify:
1. All case citations mentioned (Supreme Court, High Courts)
2. Key legal precedents relevant to this matter
3. How precedents support or oppose the legal position
4. Landmark Indian judgments that may apply

Document:
{text[:5000]}
"""
    return {"case_analysis": _call(prompt)}


#5. Contract Analyzer
def contract_analyzer(text: str) -> dict:
    prompt = f"""You are the Contract Analyzer for Juris.AI specializing in Indian contract law.
Analyze this contract under the Indian Contract Act 1872 and identify:
1. Key clauses and obligations for each party
2. Potentially unfair or problematic clauses
3. Missing standard clauses (arbitration, force majeure, etc.)
4. Termination conditions
5. Penalty and liability clauses

Contract:
{text[:5000]}
"""
    return {"contract_analysis": _call(prompt)}


#6. Legal Risk Assessor 
def legal_risk_assessor(text: str, contract_analysis: str = "") -> dict:
    prompt = f"""You are the Legal Risk Assessor for Juris.AI.
Based on the document and contract analysis below, identify and score each risk:
- HIGH risk: Immediate legal exposure or financial loss
- MEDIUM risk: Potential disputes or compliance issues
- LOW risk: Minor concerns or standard deviations

For each risk: describe it, rate it, and suggest mitigation.

Document: {text[:3000]}
Contract Analysis: {contract_analysis[:2000]}
"""
    return {"risk_assessment": _call(prompt)}


#Compliance Checker 
def compliance_checker(text: str, intake: str = "") -> dict:
    prompt = f"""You are the Compliance Checker for Juris.AI (Indian law).
Check the following document for compliance with key Indian statutes:
- Indian Contract Act 1872
- Companies Act 2013
- Income Tax Act 1961
- Consumer Protection Act 2019
- Information Technology Act 2000
- Any other applicable acts based on document type

Document type context: {intake}
Document:
{text[:5000]}
"""
    return {"compliance_report": _call(prompt)}


#Litigation Probability Assessor 
def litigation_probability_assessor(text: str, case_analysis: str = "", risk: str = "") -> dict:
    prompt = f"""You are the Litigation Probability Assessor for Juris.AI.
Based on the document, case law analysis, and risk assessment, predict:

1. Win probability (0-100%) with reasoning
2. Loss probability (0-100%) with reasoning  
3. Key factors favouring the client
4. Key factors against the client
5. Strength of legal position (Strong / Moderate / Weak)
6. Recommended course of action

Case Analysis: {case_analysis[:2000]}
Risk Assessment: {risk[:2000]}
Document: {text[:3000]}
"""
    return {"prediction": _call(prompt)}


#Case Strategy Advisor 
def case_strategy_advisor(text: str, prediction: str = "") -> dict:
    prompt = f"""You are the Case Strategy Advisor for Juris.AI.
Based on the legal prediction and document, recommend:
1. Top 3 legal strategies ranked by effectiveness
2. Evidence that needs to be gathered
3. Expert witnesses that may be required
4. Timeline and critical deadlines
5. Alternative dispute resolution options (arbitration/mediation)

Prediction: {prediction[:2000]}
Document: {text[:3000]}
"""
    return {"strategy": _call(prompt)}


#Legal Document Formatter
def legal_document_formatter(content: str, doc_type: str = "analysis") -> dict:
    prompt = f"""You are the Legal Document Formatter for Juris.AI.
Format the following legal content as a professional Indian legal {doc_type}:
- Use proper headings and numbered sections
- Apply Indian citation format (AIR/SCC)
- Include a formal header and footer structure
- Ensure proper legal language and tone
- Add "Prepared by Juris.AI" disclaimer at end

Content:
{content[:5000]}
"""
    return {"formatted_output": _call(prompt)}


#11. Dual Output Generator
def dual_output_generator(professional_content: str) -> dict:
    prompt = f"""You are the Plain Language Translator for Juris.AI.
Take the following professional legal document and rewrite it in:
- Simple, everyday English (Class 8 reading level)
- No legal jargon — replace every legal term with a plain explanation
- Use short sentences and bullet points
- Add a "What this means for you" section at the end
- Keep it friendly and reassuring

Professional Legal Content:
{professional_content[:5000]}
"""
    return {"layman_output": _call(prompt)}
