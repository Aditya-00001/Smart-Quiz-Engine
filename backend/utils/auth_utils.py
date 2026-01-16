from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password:str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)

def verify_password(password:str, hashed:str) -> bool:
    """Verify a plaintext password against a hashed password."""
    return pwd_context.verify(password, hashed)