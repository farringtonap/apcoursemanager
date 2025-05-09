import uvicorn
import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from typing import AsyncGenerator

from db import AsyncSessionLocal, engine, Base
from models import StudentProfile, APClass
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="AP Recommendation Service")

# Health check
@app.get("/", include_in_schema=False)
async def _health_check():
    return {"status": "ok"}

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://apcoursemanager.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dev-only: auto-create tables
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# DB session dependency
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

@app.get("/student-data")
async def read_student_data(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudentProfile))
    return result.scalars().all()

@app.get("/ap-classes")
async def read_ap_classes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(APClass).where(APClass.offered == True)
    )
    return result.scalars().all()

@app.get("/recommend")
async def recommend(db: AsyncSession = Depends(get_db), top_k: int = 3):
    # Fetch the single most recent student
    result = await db.execute(
        select(StudentProfile)
        .order_by(desc(StudentProfile.createdAt))
        .limit(1)
    )
    latest = result.scalars().first()
    if not latest:
        return []

    # Fetch offered AP classes
    result = await db.execute(
        select(APClass).where(APClass.offered == True)
    )
    ap_classes = result.scalars().all()
    if not ap_classes:
        return []

    # Build TF-IDF corpus
    class_docs = [f"{c.name} {c.description}" for c in ap_classes]
    student_doc = " ".join(latest.interests or [])
    tfidf = TfidfVectorizer().fit_transform([student_doc] + class_docs)

    sims = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()
    top_indices = sims.argsort()[::-1][:top_k]
    return [ap_classes[i].name for i in top_indices]

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
