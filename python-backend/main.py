import uvicorn
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from db import AsyncSessionLocal, engine, Base
from models import StudentProfile, APClass

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from typing import AsyncGenerator
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db import AsyncSessionLocal  # your session factory

app = FastAPI(title="AP Recommendation Service")

# Create tables if missing (dev only)
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
    result = await db.execute(select(APClass).where(APClass.offered == True))
    return result.scalars().all()

@app.get("/recommend")
async def recommend(db: AsyncSession = Depends(get_db), top_k: int = 5):
    # 1) fetch latest student
    students = (await db.execute(select(StudentProfile).order_by(StudentProfile.createdAt))).scalars().all()
    if not students:
        return []
    latest: StudentProfile = students[-1]

    # 2) fetch offered AP classes
    ap_classes = (await db.execute(select(APClass).where(APClass.offered == True))).scalars().all()
    if not ap_classes:
        return []

    # 3) build corpus: one doc per AP class, plus one doc for student interests
    class_docs = [
        f"{c.name} {c.description}"
        for c in ap_classes
    ]
    student_doc = " ".join(latest.interests)

    corpus = [student_doc] + class_docs

    # 4) vectorize
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform(corpus)  # shape = (1 + n_classes, n_features)

    # 5) compute cosine similarity between student (row 0) and each class
    sims = cosine_similarity(tfidf[0:1], tfidf[1:]).flatten()  # length = n_classes

    # 6) pick top_k indices
    top_indices = sims.argsort()[::-1][:top_k]

    # 7) return the names of the top_k classes
    recommendations = [ap_classes[i].name for i in top_indices]
    return recommendations

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
