import os
import ssl
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv(override=True)  # now os.environ["DATABASE_URL"] is populated

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL must be set in .env")

print("⮕ Loaded DATABASE_URL:", DATABASE_URL)

# Create a default SSL context (will verify certificates)
ssl_ctx = ssl.create_default_context()

# This will now pick up asyncpg:
engine = create_async_engine(DATABASE_URL, echo=True, connect_args={"ssl": ssl_ctx}, )
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
