import os
import ssl
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Load .env locally (won't override Render/Vercel env if no .env file exists there)
load_dotenv(override=True)

# 1) Grab the raw URL
raw_url = os.getenv("DATABASE_URL")
if not raw_url:
    raise RuntimeError("DATABASE_URL must be set in the environment")

print("⮕ Loaded raw DATABASE_URL:", raw_url)

# 2) Rewrite the scheme if needed
if raw_url.startswith("postgres://"):
    url = raw_url.replace("postgres://", "postgresql+asyncpg://", 1)
else:
    url = raw_url

# 3) Strip off any query params (asyncpg handles SSL via ssl.SSLContext below)
url = url.split("?", 1)[0]

print("⮕ Using cleaned DATABASE_URL:", url)

# 4) Build a TLS context that *verifies* certificates by default
ssl_ctx = ssl.create_default_context()

# 5) Create the async engine with our SSLContext
engine = create_async_engine(
    url,
    echo=True,
    connect_args={"ssl": ssl_ctx},
)

# 6) Session factory and Base
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)
Base = declarative_base()
