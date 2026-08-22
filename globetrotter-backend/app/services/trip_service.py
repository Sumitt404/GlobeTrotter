from datetime import date
from sqlalchemy import select,delete
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models import Trip,Stop,City,Activity,TripActivity

async def owned_trip(db,trip_id,user_id):
    trip=await db.scalar(select(Trip).options(selectinload(Trip.stops)).where(Trip.id==trip_id,Trip.user_id==user_id))
    if not trip: raise HTTPException(404,"Trip not found")
    return trip
def validate_stop_dates(trip,arr,dep):
    if dep<arr: raise HTTPException(422,"Departure date cannot be before arrival date")
    if arr<trip.start_date or dep>trip.end_date: raise HTTPException(422,"Stop dates must be within trip dates")
def overlap(a_start,a_end,b_start,b_end): return a_start < b_end and b_start < a_end
async def validate_activity(db,stop,activity_id,activity_date,start,end,ignore_id=None):
    act=await db.get(Activity,activity_id)
    if not act: raise HTTPException(404,"Activity not found")
    if act.city_id!=stop.city_id: raise HTTPException(422,"Activity does not belong to the selected city")
    if not (stop.arrival_date<=activity_date<=stop.departure_date): raise HTTPException(422,"Activity date is outside the stop dates")
    if end<=start: raise HTTPException(422,"End time must be after start time")
    q=select(TripActivity).where(TripActivity.stop_id==stop.id,TripActivity.activity_date==activity_date)
    for x in (await db.scalars(q)).all():
        if x.id!=ignore_id and overlap(start,end,x.start_time,x.end_time): raise HTTPException(409,"Activity overlaps another activity")
    return act
