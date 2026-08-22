import asyncio
from logging.config import fileConfig
from alembic import context
from app.core.config import settings
from app.core.database import Base
from app.models import *
config=context.config
config.set_main_option("sqlalchemy.url",settings.database_url.replace("%","%%"))
if config.config_file_name:fileConfig(config.config_file_name)
target_metadata=Base.metadata
def run_migrations_offline():
    context.configure(url=settings.database_url.replace("+asyncpg",""),target_metadata=target_metadata,literal_binds=True,compare_type=True)
    with context.begin_transaction():context.run_migrations()
async def run_async():
    from sqlalchemy.ext.asyncio import create_async_engine
    engine=create_async_engine(settings.database_url)
    async with engine.connect() as c: await c.run_sync(lambda conn: context.configure(connection=conn,target_metadata=target_metadata,compare_type=True)); await c.run_sync(lambda conn: context.run_migrations())
    await engine.dispose()
def run_migrations_online(): asyncio.run(run_async())
if context.is_offline_mode():run_migrations_offline()
else:run_migrations_online()
