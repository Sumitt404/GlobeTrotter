from contextlib import asynccontextmanager
from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.utils.errors import validation_handler
from app.routers import auth,users,trips,cities,activities,budget,calendar,sharing,ai,health

@asynccontextmanager
async def lifespan(app): yield
app=FastAPI(title="GlobeTrotter API",version="1.0.0",description="AI-powered travel planning backend",lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=settings.cors_list,allow_credentials=True,allow_methods=["*"],allow_headers=["*"])
app.add_exception_handler(RequestValidationError,validation_handler)
for r in [health.router,auth.router,users.router,trips.router,cities.router,activities.router,budget.router,calendar.router,sharing.router,ai.router]: app.include_router(r)
