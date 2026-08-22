from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import hash_password,verify_password,create_access_token
from app.dependencies.auth import get_current_user
from app.models import User,UserPreference
from app.schemas import RegisterIn,LoginIn,TokenOut,UserOut
router=APIRouter(prefix="/api/auth",tags=["Authentication"])
@router.post("/register",response_model=TokenOut,status_code=201)
async def register(req:RegisterIn,db:AsyncSession=Depends(get_db)):
    if await db.scalar(select(User).where(User.email==req.email)): raise HTTPException(409,"Email already registered")
    u=User(name=req.name.strip(),email=req.email,password_hash=hash_password(req.password)); u.preferences=UserPreference(); db.add(u); await db.commit(); await db.refresh(u)
    return TokenOut(access_token=create_access_token(u.id),user=u)
@router.post("/login",response_model=TokenOut)
async def login(req:LoginIn,db:AsyncSession=Depends(get_db)):
    u=await db.scalar(select(User).where(User.email==req.email))
    if not u or not verify_password(req.password,u.password_hash): raise HTTPException(401,"Invalid email or password")
    return TokenOut(access_token=create_access_token(u.id),user=u)
@router.get("/me",response_model=UserOut)
async def me(u=Depends(get_current_user)): return u
