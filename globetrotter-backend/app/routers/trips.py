from datetime import date
from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models import Trip,Stop,City,Activity,TripActivity
from app.schemas import *
from app.services.trip_service import owned_trip,validate_stop_dates,validate_activity
router=APIRouter(prefix="/api",tags=["Trips"])
@router.get("/trips")
async def list_trips(u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    rows=(await db.scalars(select(Trip).where(Trip.user_id==u.id).order_by(Trip.start_date.desc()))).all(); return rows
@router.post("/trips",status_code=201)
async def create_trip(req:TripCreate,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=Trip(user_id=u.id,**req.model_dump()); db.add(t); await db.commit(); await db.refresh(t); return t
@router.get("/trips/{trip_id}")
async def get_trip(trip_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)): return await owned_trip(db,trip_id,u.id)
@router.put("/trips/{trip_id}")
async def update_trip(trip_id:int,req:TripUpdate,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await owned_trip(db,trip_id,u.id); data=req.model_dump(exclude_none=True); start=data.get("start_date",t.start_date); end=data.get("end_date",t.end_date)
    if end<start: raise HTTPException(422,"End date cannot be before start date")
    for k,v in data.items():setattr(t,k,v)
    await db.commit(); await db.refresh(t); return t
@router.delete("/trips/{trip_id}",status_code=204)
async def delete_trip(trip_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await owned_trip(db,trip_id,u.id); await db.delete(t); await db.commit()
@router.post("/trips/{trip_id}/stops",response_model=StopOut,status_code=201)
async def add_stop(trip_id:int,req:StopCreate,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await owned_trip(db,trip_id,u.id); validate_stop_dates(t,req.arrival_date,req.departure_date); c=await db.get(City,req.city_id)
    if not c:raise HTTPException(404,"City not found")
    n=len(t.stops); s=Stop(trip_id=t.id,sequence_order=n,**req.model_dump()); db.add(s); await db.commit(); await db.refresh(s); return s
@router.put("/stops/{stop_id}",response_model=StopOut)
async def update_stop(stop_id:int,req:StopUpdate,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    s=await db.get(Stop,stop_id);
    if not s:raise HTTPException(404,"Stop not found")
    t=await owned_trip(db,s.trip_id,u.id); data=req.model_dump(exclude_none=True); arr=data.get("arrival_date",s.arrival_date); dep=data.get("departure_date",s.departure_date); validate_stop_dates(t,arr,dep)
    if "city_id" in data and not await db.get(City,data["city_id"]):raise HTTPException(404,"City not found")
    for k,v in data.items():setattr(s,k,v)
    await db.commit(); await db.refresh(s); return s
@router.delete("/stops/{stop_id}",status_code=204)
async def delete_stop(stop_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    s=await db.get(Stop,stop_id);
    if not s:raise HTTPException(404,"Stop not found")
    await owned_trip(db,s.trip_id,u.id); await db.delete(s); await db.commit()
@router.patch("/trips/{trip_id}/stops/reorder")
async def reorder_stops(trip_id:int,req:ReorderIn,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await owned_trip(db,trip_id,u.id); ids={s.id for s in t.stops}
    if ids!=set(req.stop_ids) or len(req.stop_ids)!=len(ids):raise HTTPException(422,"stop_ids must contain exactly the trip stops")
    for i,sid in enumerate(req.stop_ids): next(s for s in t.stops if s.id==sid).sequence_order=i
    await db.commit(); return {"success":True}
@router.post("/stops/{stop_id}/activities",response_model=TripActivityOut,status_code=201)
async def add_activity(stop_id:int,req:TripActivityCreate,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    s=await db.get(Stop,stop_id);
    if not s:raise HTTPException(404,"Stop not found")
    await owned_trip(db,s.trip_id,u.id); act=await validate_activity(db,s,req.activity_id,req.activity_date,req.start_time,req.end_time)
    data=req.model_dump(); data["estimated_cost"]=act.estimated_cost if data["estimated_cost"] is None else data["estimated_cost"]; data["sequence_order"]=len(s.trip_activities); ta=TripActivity(stop_id=stop_id,**data); db.add(ta); await db.commit(); await db.refresh(ta); return ta
@router.put("/trip-activities/{activity_id}",response_model=TripActivityOut)
async def update_activity(activity_id:int,req:TripActivityUpdate,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    ta=await db.get(TripActivity,activity_id);
    if not ta:raise HTTPException(404,"Trip activity not found")
    s=await db.get(Stop,ta.stop_id); await owned_trip(db,s.trip_id,u.id); data=req.model_dump(exclude_none=True); d=data.get("activity_date",ta.activity_date); st=data.get("start_time",ta.start_time); en=data.get("end_time",ta.end_time); await validate_activity(db,s,ta.activity_id,d,st,en,ta.id)
    for k,v in data.items():setattr(ta,k,v)
    await db.commit(); await db.refresh(ta); return ta
@router.delete("/trip-activities/{activity_id}",status_code=204)
async def delete_activity(activity_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    ta=await db.get(TripActivity,activity_id);
    if not ta:raise HTTPException(404,"Trip activity not found")
    s=await db.get(Stop,ta.stop_id); await owned_trip(db,s.trip_id,u.id); await db.delete(ta); await db.commit()
@router.patch("/stops/{stop_id}/activities/reorder")
async def reorder_activities(stop_id:int,req:ActivityReorderIn,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    s=await db.get(Stop,stop_id);
    if not s:raise HTTPException(404,"Stop not found")
    await owned_trip(db,s.trip_id,u.id); ids={x.id for x in s.trip_activities}
    if ids!=set(req.trip_activity_ids) or len(ids)!=len(req.trip_activity_ids):raise HTTPException(422,"trip_activity_ids must contain exactly the stop activities")
    for i,xid in enumerate(req.trip_activity_ids):next(x for x in s.trip_activities if x.id==xid).sequence_order=i
    await db.commit(); return {"success":True}
