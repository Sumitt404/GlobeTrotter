from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models import Trip,Stop,TripActivity
from app.schemas import GenerateItineraryIn,AIItineraryOut,OptimizeOut,ChatIn,ChatOut
from app.services.ai_service import generate,optimize,chat
from app.services.budget_service import get_budget
from app.services.trip_service import owned_trip
router=APIRouter(prefix="/api/ai",tags=["AI"])
@router.post("/generate-itinerary",response_model=AIItineraryOut)
async def generate_itinerary(req:GenerateItineraryIn,u=Depends(get_current_user)): return await generate(req)
@router.post("/optimize-budget/{trip_id}",response_model=OptimizeOut)
async def optimize_budget(trip_id:int,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await owned_trip(db,trip_id,u.id); b=await get_budget(db,trip_id); context={"trip_budget":t.budget,"current_estimated_expenses":b,"cities":[s.city_id for s in t.stops],"dates":{"start":str(t.start_date),"end":str(t.end_date)}}; return await optimize(context)
@router.post("/chat",response_model=ChatOut)
async def ai_chat(req:ChatIn,u=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    t=await db.scalar(select(Trip).options(selectinload(Trip.stops).selectinload(Stop.city),selectinload(Trip.stops).selectinload(Stop.trip_activities).selectinload(TripActivity.activity)).where(Trip.id==req.trip_id,Trip.user_id==u.id));
    if not t:raise HTTPException(404,"Trip not found")
    b=await get_budget(db,t.id); context={"trip":{"name":t.name,"dates":[str(t.start_date),str(t.end_date)],"budget":t.budget},"cities":[s.city.name for s in t.stops],"activities":[{"name":a.activity.name,"date":str(a.activity_date),"cost":a.estimated_cost,"city":s.city.name} for s in t.stops for a in s.trip_activities],"budget_summary":b};
    raw=await chat(context,req.message)
    import json
    try:return json.loads(raw)
    except Exception:raise HTTPException(502,"AI returned invalid chat JSON")
