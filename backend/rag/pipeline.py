import pypdf
import io

def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
    if filename.lower().endswith('.pdf'):
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        return '\n'.join(page.extract_text() or '' for page in reader.pages)
    return file_bytes.decode('utf-8', errors='ignore')

def ingest_text(text: str, doc_id: str, metadata: dict = {}) -> int:
    return 0

def retrieve(query: str, n_results: int = 5) -> list:
    return []
