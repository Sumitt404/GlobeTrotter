import json
from datetime import date
from openai import AsyncOpenAI
from fastapi import HTTPException
from app.core.config import settings
from app.schemas import AIItineraryOut,GenerateItineraryIn

SYSTEM='You are GlobeTrotter AI, a practical travel planner. Create realistic itineraries that respect dates, budget, interests, travel time, geography, reasonable daily activity counts, and avoid duplicates. Return JSON only. Never invent database IDs. Use realistic estimated costs in the requested currency.'

async def _ask(payload, schema_hint):
    if not settings.openai_api_key: raise HTTPException(503,"AI service is not configured")
    client=AsyncOpenAI(api_key=settings.openai_api_key)
    try:
        r=await client.chat.completions.create(model=settings.openai_model,messages=[{"role":"system","content":SYSTEM},{"role":"user","content":payload}],response_format={"type":"json_object"},temperature=0.4)
        return r.choices[0].message.content
    except Exception as e: raise HTTPException(502,f"AI provider error: {type(e).__name__}")

async def generate(req:GenerateItineraryIn):
    content=await _ask(json.dumps(req.model_dump(mode="json"))+"\nReturn fields: trip_summary,cities[{city,days,activities[{date,time,name,category,estimated_cost}]}],estimated_total,budget_remaining.","itinerary")
    try: return AIItineraryOut.model_validate(json.loads(content))
    except Exception: raise HTTPException(502,"AI returned invalid itinerary JSON")

async def optimize(context):
    content=await _ask(json.dumps(context)+"\nReturn JSON with current_cost,budget,over_budget (numeric amount, 0 if under), suggestions[{type,current,suggested,saving}].", "optimization")
    try: return json.loads(content)
    except Exception: raise HTTPException(502,"AI returned invalid optimization JSON")

async def chat(context,message):
    return await _ask(json.dumps(context)+"\nUser question: "+message+"\nReturn JSON: {answer:string}.","chat")
