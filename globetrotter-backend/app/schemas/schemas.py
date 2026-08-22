from datetime import date,time
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator

class UserOut(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    id:int; name:str; email:EmailStr; profile_photo:str|None=None
class RegisterIn(BaseModel): name:str=Field(min_length=1,max_length=120); email:EmailStr; password:str=Field(min_length=8,max_length=128)
class LoginIn(BaseModel): email:EmailStr; password:str
class TokenOut(BaseModel): access_token:str; token_type:str="bearer"; user:UserOut
class PreferenceIn(BaseModel): preferred_currency:str="INR"; travel_style:str="balanced"; preferred_categories:list[str]=[]; preferred_budget_level:str="medium"
class PreferenceOut(PreferenceIn): model_config=ConfigDict(from_attributes=True); id:int; user_id:int
class UserUpdate(BaseModel): name:str|None=None; email:EmailStr|None=None; profile_photo:str|None=None

class TripCreate(BaseModel):
    name:str=Field(min_length=1,max_length=160); description:str=""; start_date:date; end_date:date; budget:float=Field(ge=0); currency:str="INR"; cover_photo:str=""
    @model_validator(mode="after")
    def dates(self):
        if self.end_date<self.start_date: raise ValueError("End date cannot be before start date")
        return self
class TripUpdate(BaseModel): name:str|None=None; description:str|None=None; start_date:date|None=None; end_date:date|None=None; budget:float|None=Field(default=None,ge=0); currency:str|None=None; cover_photo:str|None=None
class CityOut(BaseModel): model_config=ConfigDict(from_attributes=True); id:int; name:str; country:str; region:str; description:str; image_url:str; cost_index:float; popularity:float; latitude:float; longitude:float
class ActivityOut(BaseModel): model_config=ConfigDict(from_attributes=True); id:int; city_id:int; name:str; description:str; category:str; duration_minutes:int; estimated_cost:float; currency:str; rating:float; image_url:str
class TripActivityCreate(BaseModel): activity_id:int; activity_date:date; start_time:time; end_time:time; estimated_cost:float|None=Field(default=None,ge=0); notes:str=""
class TripActivityUpdate(BaseModel): activity_date:date|None=None; start_time:time|None=None; end_time:time|None=None; estimated_cost:float|None=Field(default=None,ge=0); notes:str|None=None
class StopCreate(BaseModel): city_id:int; arrival_date:date; departure_date:date
class StopUpdate(BaseModel): city_id:int|None=None; arrival_date:date|None=None; departure_date:date|None=None
class ReorderIn(BaseModel): stop_ids:list[int]
class ActivityReorderIn(BaseModel): trip_activity_ids:list[int]
class StopOut(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    id:int; city_id:int; arrival_date:date; departure_date:date; sequence_order:int
class TripActivityOut(BaseModel):
    model_config=ConfigDict(from_attributes=True)
    id:int; stop_id:int; activity_id:int; activity_date:date; start_time:time; end_time:time; estimated_cost:float; notes:str; sequence_order:int
class TripDetail(TripCreate):
    model_config=ConfigDict(from_attributes=True)
    id:int; user_id:int; cover_photo:str; is_public:bool; share_token:str|None=None; stops:list[StopOut]=[]
class BudgetOut(BaseModel): trip_budget:float; estimated_total:float; remaining:float; percentage_used:float; average_per_day:float; breakdown:dict[str,float]; daily_costs:list[dict]; over_budget:bool
class CalendarEvent(BaseModel): id:int; title:str; date:date; start:time; end:time; city:str; cost:float
class CalendarOut(BaseModel): events:list[CalendarEvent]
class ShareOut(BaseModel): share_token:str; public_url:str; is_public:bool
class AIActivity(BaseModel): date:date; time:time; name:str; category:str; estimated_cost:float
class AICity(BaseModel): city:str; days:int; activities:list[AIActivity]
class AIItineraryOut(BaseModel): trip_summary:str; cities:list[AICity]; estimated_total:float; budget_remaining:float
class GenerateItineraryIn(BaseModel): destination:str; cities:list[str]=[]; start_date:date; end_date:date; budget:float=Field(ge=0); currency:str="INR"; interests:list[str]=[]; travel_style:str="balanced"
class OptimizeOut(BaseModel): current_cost:float; budget:float; over_budget:float; suggestions:list[dict]
class ChatIn(BaseModel): trip_id:int; message:str=Field(min_length=1,max_length=4000)
class ChatOut(BaseModel): answer:str
