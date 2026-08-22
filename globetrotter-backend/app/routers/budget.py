from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.services.trip_service import owned_trip
from app.services.budget_service import get_budget
from app.schemas import BudgetOut
router=APIRouter(prefix="/api",tags=["Budget"])
@router.get("/trips/{trip_id}/budget",response_model=BudgetOut)
async def budget(trip_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    await owned_trip(db,trip_id,u.id); data=await get_budget(db,trip_id); return data
