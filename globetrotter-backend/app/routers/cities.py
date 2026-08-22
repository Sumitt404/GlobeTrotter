from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import select,func
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models import City
from app.schemas import CityOut
router=APIRouter(prefix="/api/cities",tags=["Cities"])
@router.get("",response_model=dict)
async def cities(search:str|None=None,country:str|None=None,region:str|None=None,cost_index:float|None=None,popularity:float|None=None,page:int=1,limit:int=20,db:AsyncSession=Depends(get_db)):
    q=select(City); filters=[]
    if search: filters.append(City.name.ilike(f"%{search}%"))
    if country: filters.append(City.country.ilike(f"%{country}%"))
    if region: filters.append(City.region.ilike(f"%{region}%"))
    if cost_index is not None: filters.append(City.cost_index<=cost_index)
    if popularity is not None: filters.append(City.popularity>=popularity)
    if filters: q=q.where(*filters)
    total=await db.scalar(select(func.count()).select_from(City).where(*filters))
    rows=(await db.scalars(q.offset((page-1)*limit).limit(limit))).all()
    return {"items":[CityOut.model_validate(x) for x in rows],"page":page,"limit":limit,"total":total,"pages":(total+limit-1)//limit}
@router.get("/{city_id}",response_model=CityOut)
async def city(city_id:int,db:AsyncSession=Depends(get_db)):
    x=await db.get(City,city_id)
    if not x: raise HTTPException(404,"City not found")
    return x
