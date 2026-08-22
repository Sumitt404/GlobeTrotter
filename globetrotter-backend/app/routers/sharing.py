import secrets
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models import Trip,Stop,TripActivity
from app.schemas import ShareOut
from app.services.trip_service import owned_trip
router=APIRouter(prefix="/api",tags=["Sharing"])
@router.post("/trips/{trip_id}/share",response_model=ShareOut)
async def share(trip_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await owned_trip(db,trip_id,u.id); t.is_public=True; t.share_token=t.share_token or secrets.token_urlsafe(32); await db.commit(); return {"share_token":t.share_token,"public_url":f"/share/{t.share_token}","is_public":True}
@router.delete("/trips/{trip_id}/share",status_code=204)
async def unshare(trip_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await owned_trip(db,trip_id,u.id); t.is_public=False; t.share_token=None; await db.commit()
@router.get("/public/trips/{share_token}")
async def public_trip(share_token:str,db:AsyncSession=Depends(get_db)):
    t=await db.scalar(select(Trip).options(selectinload(Trip.stops).selectinload(Stop.city),selectinload(Trip.stops).selectinload(Stop.trip_activities).selectinload(TripActivity.activity)).where(Trip.share_token==share_token,Trip.is_public==True))
    if not t:raise HTTPException(404,"Public trip not found")
    return {"id":t.id,"name":t.name,"description":t.description,"start_date":t.start_date,"end_date":t.end_date,"budget":t.budget,"currency":t.currency,"cover_photo":t.cover_photo,"cities":[{"id":s.city.id,"name":s.city.name,"country":s.city.country} for s in t.stops],"activities":[{"id":a.id,"name":a.activity.name,"date":a.activity_date,"start_time":a.start_time,"end_time":a.end_time,"cost":a.estimated_cost,"city":s.city.name} for s in t.stops for a in s.trip_activities]}
@router.post("/public/trips/{share_token}/copy")
async def copy_trip(share_token:str,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    src=await db.scalar(select(Trip).options(selectinload(Trip.stops).selectinload(Stop.trip_activities)).where(Trip.share_token==share_token,Trip.is_public==True))
    if not src:raise HTTPException(404,"Public trip not found")
    new=Trip(user_id=u.id,name=src.name+" (Copy)",description=src.description,start_date=src.start_date,end_date=src.end_date,cover_photo=src.cover_photo,budget=src.budget,currency=src.currency); db.add(new); await db.flush()
    for s in src.stops:
        ns=Stop(trip_id=new.id,city_id=s.city_id,arrival_date=s.arrival_date,departure_date=s.departure_date,sequence_order=s.sequence_order); db.add(ns); await db.flush()
        for a in s.trip_activities: db.add(TripActivity(stop_id=ns.id,activity_id=a.activity_id,activity_date=a.activity_date,start_time=a.start_time,end_time=a.end_time,estimated_cost=a.estimated_cost,notes=a.notes,sequence_order=a.sequence_order))
    await db.commit(); return {"trip_id":new.id}
