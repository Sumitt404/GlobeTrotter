from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models import Activity
from app.schemas import ActivityOut
router=APIRouter(prefix="/api",tags=["Activities"])
@router.get("/cities/{city_id}/activities",response_model=list[ActivityOut])
async def city_activities(city_id:int,category:str|None=None,max_cost:float|None=None,max_duration:int|None=None,min_rating:float|None=None,db:AsyncSession=Depends(get_db)):
    q=select(Activity).where(Activity.city_id==city_id)
    if category:q=q.where(Activity.category.ilike(category))
    if max_cost is not None:q=q.where(Activity.estimated_cost<=max_cost)
    if max_duration is not None:q=q.where(Activity.duration_minutes<=max_duration)
    if min_rating is not None:q=q.where(Activity.rating>=min_rating)
    return (await db.scalars(q)).all()
@router.get("/activities/{activity_id}",response_model=ActivityOut)
async def activity(activity_id:int,db:AsyncSession=Depends(get_db)):
    x=await db.get(Activity,activity_id)
    if not x:raise HTTPException(404,"Activity not found")
    return x
