from fastapi import Depends,HTTPException,status
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import decode_token
from app.models import User

bearer=HTTPBearer(auto_error=False)
async def get_current_user(creds:HTTPAuthorizationCredentials|None=Depends(bearer),db:AsyncSession=Depends(get_db)):
    if not creds: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Not authenticated")
    try: uid=decode_token(creds.credentials)
    except Exception: raise HTTPException(status_code=401,detail="Invalid or expired token")
    user=await db.get(User,uid)
    if not user: raise HTTPException(status_code=401,detail="User not found")
    return user
