from collections import defaultdict
from datetime import timedelta
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Trip,Stop,TripActivity,Expense

async def get_budget(db:AsyncSession,trip_id:int):
    trip=await db.scalar(select(Trip).options(selectinload(Trip.stops).selectinload(Stop.trip_activities)).where(Trip.id==trip_id))
    if not trip: return None
    breakdown=defaultdict(float); daily=defaultdict(float)
    for e in trip.expenses:
        breakdown[e.category.lower()]+=e.amount; daily[e.expense_date.isoformat()]+=e.amount
    for stop in trip.stops:
        for ta in stop.trip_activities:
            breakdown["activities"]+=ta.estimated_cost; daily[ta.activity_date.isoformat()]+=ta.estimated_cost
    total=round(sum(breakdown.values()),2); days=(trip.end_date-trip.start_date).days+1; days=max(days,1)
    costs=[]; d=trip.start_date
    while d<=trip.end_date:
        costs.append({"date":d.isoformat(),"amount":round(daily.get(d.isoformat(),0),2)}); d+=timedelta(days=1)
    return {"trip_budget":trip.budget,"estimated_total":total,"remaining":round(trip.budget-total,2),"percentage_used":round(total/trip.budget*100,3) if trip.budget else 0,"average_per_day":round(total/days,2),"breakdown":dict(breakdown),"daily_costs":costs,"over_budget":total>trip.budget}
