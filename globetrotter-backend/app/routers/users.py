from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models import User,UserPreference
from app.schemas import UserOut,UserUpdate,PreferenceIn,PreferenceOut
router=APIRouter(prefix="/api/users",tags=["Users"])
@router.get("/me",response_model=UserOut)
async def get_me(u=Depends(get_current_user)): return u
@router.put("/me",response_model=UserOut)
async def update_me(req:UserUpdate,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    if req.email and req.email!=u.email:
        from sqlalchemy import select
        if await db.scalar(select(User).where(User.email==req.email)): raise HTTPException(409,"Email already registered")
    for k,v in req.model_dump(exclude_none=True).items(): setattr(u,k,v)
    await db.commit(); await db.refresh(u); return u
@router.get("/me/preferences",response_model=PreferenceOut)
async def prefs(u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    if not u.preferences: u.preferences=UserPreference(); await db.commit(); await db.refresh(u)
    return u.preferences
@router.put("/me/preferences",response_model=PreferenceOut)
async def update_prefs(req:PreferenceIn,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    if not u.preferences: u.preferences=UserPreference()
    for k,v in req.model_dump().items(): setattr(u.preferences,k,v)
    await db.commit(); await db.refresh(u.preferences); return u.preferences
