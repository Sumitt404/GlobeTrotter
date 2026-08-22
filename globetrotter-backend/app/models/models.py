from datetime import datetime,date,time
from sqlalchemy import String, Text, Integer, Float, Boolean, Date, Time, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class User(Base):
    __tablename__="users"
    id:Mapped[int]=mapped_column(primary_key=True)
    name:Mapped[str]=mapped_column(String(120))
    email:Mapped[str]=mapped_column(String(255),unique=True,index=True)
    password_hash:Mapped[str]=mapped_column(String(512))
    profile_photo:Mapped[str|None]=mapped_column(String(500),nullable=True)
    created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
    updated_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)
    trips:Mapped[list["Trip"]]=relationship(back_populates="user",cascade="all, delete-orphan")
    preferences:Mapped["UserPreference|None"]=relationship(back_populates="user",uselist=False,cascade="all, delete-orphan")

class UserPreference(Base):
    __tablename__="user_preferences"
    id:Mapped[int]=mapped_column(primary_key=True)
    user_id:Mapped[int]=mapped_column(ForeignKey("users.id",ondelete="CASCADE"),unique=True)
    preferred_currency:Mapped[str]=mapped_column(String(8),default="INR")
    travel_style:Mapped[str]=mapped_column(String(40),default="balanced")
    preferred_categories:Mapped[list]=mapped_column(JSON,default=list)
    preferred_budget_level:Mapped[str]=mapped_column(String(30),default="medium")
    user:Mapped[User]=relationship(back_populates="preferences")

class City(Base):
    __tablename__="cities"
    id:Mapped[int]=mapped_column(primary_key=True)
    name:Mapped[str]=mapped_column(String(120),index=True)
    country:Mapped[str]=mapped_column(String(120),index=True)
    region:Mapped[str]=mapped_column(String(120),default="")
    description:Mapped[str]=mapped_column(Text,default="")
    image_url:Mapped[str]=mapped_column(String(500),default="")
    cost_index:Mapped[float]=mapped_column(Float,default=1)
    popularity:Mapped[float]=mapped_column(Float,default=50)
    latitude:Mapped[float]=mapped_column(Float,default=0)
    longitude:Mapped[float]=mapped_column(Float,default=0)
    activities:Mapped[list["Activity"]]=relationship(back_populates="city",cascade="all, delete-orphan")

class Trip(Base):
    __tablename__="trips"
    id:Mapped[int]=mapped_column(primary_key=True)
    user_id:Mapped[int]=mapped_column(ForeignKey("users.id",ondelete="CASCADE"),index=True)
    name:Mapped[str]=mapped_column(String(160))
    description:Mapped[str]=mapped_column(Text,default="")
    start_date:Mapped[date]=mapped_column(Date)
    end_date:Mapped[date]=mapped_column(Date)
    cover_photo:Mapped[str]=mapped_column(String(500),default="")
    budget:Mapped[float]=mapped_column(Float,default=0)
    currency:Mapped[str]=mapped_column(String(8),default="INR")
    is_public:Mapped[bool]=mapped_column(Boolean,default=False)
    share_token:Mapped[str|None]=mapped_column(String(128),unique=True,index=True,nullable=True)
    created_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow)
    updated_at:Mapped[datetime]=mapped_column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow)
    user:Mapped[User]=relationship(back_populates="trips")
    stops:Mapped[list["Stop"]]=relationship(back_populates="trip",cascade="all, delete-orphan",order_by="Stop.sequence_order")
    expenses:Mapped[list["Expense"]]=relationship(back_populates="trip",cascade="all, delete-orphan")

class Stop(Base):
    __tablename__="stops"
    id:Mapped[int]=mapped_column(primary_key=True)
    trip_id:Mapped[int]=mapped_column(ForeignKey("trips.id",ondelete="CASCADE"),index=True)
    city_id:Mapped[int]=mapped_column(ForeignKey("cities.id",ondelete="RESTRICT"))
    arrival_date:Mapped[date]=mapped_column(Date)
    departure_date:Mapped[date]=mapped_column(Date)
    sequence_order:Mapped[int]=mapped_column(Integer,default=0)
    trip:Mapped[Trip]=relationship(back_populates="stops")
    city:Mapped[City]=relationship()
    trip_activities:Mapped[list["TripActivity"]]=relationship(back_populates="stop",cascade="all, delete-orphan",order_by="TripActivity.sequence_order")

class Activity(Base):
    __tablename__="activities"
    id:Mapped[int]=mapped_column(primary_key=True)
    city_id:Mapped[int]=mapped_column(ForeignKey("cities.id",ondelete="CASCADE"),index=True)
    name:Mapped[str]=mapped_column(String(180),index=True)
    description:Mapped[str]=mapped_column(Text,default="")
    category:Mapped[str]=mapped_column(String(50),index=True)
    duration_minutes:Mapped[int]=mapped_column(Integer,default=60)
    estimated_cost:Mapped[float]=mapped_column(Float,default=0)
    currency:Mapped[str]=mapped_column(String(8),default="INR")
    rating:Mapped[float]=mapped_column(Float,default=4.5)
    image_url:Mapped[str]=mapped_column(String(500),default="")
    city:Mapped[City]=relationship(back_populates="activities")

class TripActivity(Base):
    __tablename__="trip_activities"
    id:Mapped[int]=mapped_column(primary_key=True)
    stop_id:Mapped[int]=mapped_column(ForeignKey("stops.id",ondelete="CASCADE"),index=True)
    activity_id:Mapped[int]=mapped_column(ForeignKey("activities.id",ondelete="RESTRICT"))
    activity_date:Mapped[date]=mapped_column(Date)
    start_time:Mapped[time]=mapped_column(Time)
    end_time:Mapped[time]=mapped_column(Time)
    estimated_cost:Mapped[float]=mapped_column(Float,default=0)
    notes:Mapped[str]=mapped_column(Text,default="")
    sequence_order:Mapped[int]=mapped_column(Integer,default=0)
    stop:Mapped[Stop]=relationship(back_populates="trip_activities")
    activity:Mapped[Activity]=relationship()

class Expense(Base):
    __tablename__="expenses"
    id:Mapped[int]=mapped_column(primary_key=True)
    trip_id:Mapped[int]=mapped_column(ForeignKey("trips.id",ondelete="CASCADE"),index=True)
    category:Mapped[str]=mapped_column(String(50))
    amount:Mapped[float]=mapped_column(Float)
    currency:Mapped[str]=mapped_column(String(8),default="INR")
    expense_date:Mapped[date]=mapped_column(Date)
    description:Mapped[str]=mapped_column(String(300),default="")
    trip:Mapped[Trip]=relationship(back_populates="expenses")
