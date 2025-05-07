from sqlalchemy import Column, Integer, Float, JSON, DateTime, String, Boolean
from sqlalchemy.sql import func
from db import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id              = Column(Integer, primary_key=True, index=True)
    interests       = Column(JSON, nullable=False)
    previousCourses = Column(JSON, nullable=True)
    GPA             = Column(Float, nullable=False)
    gradeLevel      = Column(Integer, nullable=True)
    createdAt       = Column(DateTime(timezone=True), server_default=func.now())

class APClass(Base):
    __tablename__ = "ap_classes"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, nullable=False)
    description = Column(String, nullable=False)
    resources   = Column(String, nullable=True)
    offered     = Column(Boolean, nullable=False)
    # you can add subjectId, teacherEmail, etc. if needed
