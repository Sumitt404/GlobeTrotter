from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from argon2 import PasswordHasher
from app.core.config import settings

ph=PasswordHasher()
def hash_password(password:str)->str: return ph.hash(password)
def verify_password(password:str, hashed:str)->bool:
    try: return ph.verify(hashed,password)
    except Exception: return False
def create_access_token(subject:int)->str:
    exp=datetime.now(timezone.utc)+timedelta(minutes=settings.access_token_expire_minutes)
    return jwt.encode({"sub":str(subject),"exp":exp},settings.jwt_secret_key,algorithm=settings.jwt_algorithm)
def decode_token(token:str)->int:
    payload=jwt.decode(token,settings.jwt_secret_key,algorithms=[settings.jwt_algorithm])
    return int(payload["sub"])
