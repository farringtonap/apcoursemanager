import os
import ssl
import certifi
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# 1) load .env locally (won't override cloud env if not present)
load_dotenv(override=True)

# 2) grab your raw URL
raw = os.getenv("DATABASE_URL")
if not raw:
    raise RuntimeError("DATABASE_URL must be set in the environment")

print("⮕ Raw DATABASE_URL:", raw)

# 3) rewrite the scheme and drop any query params
url = raw.replace("postgres://", "postgresql+asyncpg://", 1).split("?", 1)[0]
print("⮕ Cleaned DATABASE_URL:", url)

# 4) build an SSL context that *verifies* the server cert
ssl_ctx = ssl.create_default_context(cafile=certifi.where())

# 5) create the async engine with SSL
engine = create_async_engine(
    url,
    echo=True,
    connect_args={"ssl": ssl_ctx},
)

# 6) session factory and base
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)
Base = declarative_base()
