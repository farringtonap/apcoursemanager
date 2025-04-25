-- CreateTable
CREATE TABLE "student_profiles" (
    "interests" JSONB NOT NULL,
    "previousCourses" JSONB NOT NULL,
    "GPA" DOUBLE PRECISION NOT NULL,
    "gradeLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("GPA")
);
