from fastapi import APIRouter,Depends
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models import Trip,Stop,TripActivity
from app.schemas import CalendarOut,CalendarEvent
from app.services.trip_service import owned_trip
router=APIRouter(prefix="/api",tags=["Calendar"])
@router.get("/trips/{trip_id}/calendar",response_model=CalendarOut)
async def calendar(trip_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await db.scalar(select(Trip).options(selectinload(Trip.stops).selectinload(Stop.trip_activities).selectinload(TripActivity.activity),selectinload(Trip.stops).selectinload(Stop.city)).where(Trip.id==trip_id,Trip.user_id==u.id));
    if not t: from fastapi import HTTPException; raise HTTPException(404,"Trip not found")
    events=[]
    for s in t.stops:
        for a in s.trip_activities: events.append(CalendarEvent(id=a.id,title=a.activity.name,date=a.activity_date,start=a.start_time,end=a.end_time,city=s.city.name,cost=a.estimated_cost))
    return {"events":events}
