# ============================================================
#  Juris.AI — AES-256 Security
# ============================================================
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64, os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("AES_SECRET_KEY", "jurisai_default_key_32chars!!!!!").encode("utf-8")[:32]

def encrypt_text(plaintext: str) -> str:
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(plaintext.encode("utf-8"), AES.block_size))
    iv = base64.b64encode(cipher.iv).decode("utf-8")
    ct = base64.b64encode(ct_bytes).decode("utf-8")
    return f"{iv}:{ct}"

def decrypt_text(encrypted: str) -> str:
    iv_b64, ct_b64 = encrypted.split(":")
    iv = base64.b64decode(iv_b64)
    ct = base64.b64decode(ct_b64)
    cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(ct), AES.block_size).decode("utf-8")

def decrypt_bytes(encrypted_b64: str) -> bytes:
    """Decrypt base64-encoded encrypted file bytes from the frontend."""
    try:
        iv_b64, ct_b64 = encrypted_b64.split(":")
        iv = base64.b64decode(iv_b64)
        ct = base64.b64decode(ct_b64)
        cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv)
        return unpad(cipher.decrypt(ct), AES.block_size)
    except Exception:
        # If decryption fails, return as-is (dev mode: unencrypted upload)
        return base64.b64decode(encrypted_b64)
