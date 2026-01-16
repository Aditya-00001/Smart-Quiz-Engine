from jose import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
SECRET_KEY = "CHANGE_THIS_TO_A_SECURE_RANDOM_KEY"
ALGORITHM = "HS256"

def create_access_token(user_id:str):
    payload = {
        "sub":str(user_id),
        "exp":datetime.utcnow() + timedelta(days=1)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_access_token(token:str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return int(user_id)
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")