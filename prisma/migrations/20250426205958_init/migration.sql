-- CreateEnum
CREATE TYPE "Role" AS ENUM ('TEACHER', 'ADMIN');

-- CreateTable
CREATE TABLE "ap_classes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "resources" TEXT,
    "offered" BOOLEAN NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "teacherEmail" TEXT NOT NULL,

    CONSTRAINT "ap_classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prerequisites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_levels" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "grade_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TEACHER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" SERIAL NOT NULL,
    "interests" JSONB NOT NULL,
    "previousCourses" JSONB NOT NULL,
    "GPA" DOUBLE PRECISION NOT NULL,
    "gradeLevel" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_APClassPrerequisites" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_APClassGradeLevels" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PreRequisiteGradeLevels" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ap_classes_teacherEmail_key" ON "ap_classes"("teacherEmail");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "grade_levels_level_key" ON "grade_levels"("level");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_APClassPrerequisites_AB_unique" ON "_APClassPrerequisites"("A", "B");

-- CreateIndex
CREATE INDEX "_APClassPrerequisites_B_index" ON "_APClassPrerequisites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_APClassGradeLevels_AB_unique" ON "_APClassGradeLevels"("A", "B");

-- CreateIndex
CREATE INDEX "_APClassGradeLevels_B_index" ON "_APClassGradeLevels"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PreRequisiteGradeLevels_AB_unique" ON "_PreRequisiteGradeLevels"("A", "B");

-- CreateIndex
CREATE INDEX "_PreRequisiteGradeLevels_B_index" ON "_PreRequisiteGradeLevels"("B");

-- AddForeignKey
ALTER TABLE "ap_classes" ADD CONSTRAINT "ap_classes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ap_classes" ADD CONSTRAINT "ap_classes_teacherEmail_fkey" FOREIGN KEY ("teacherEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prerequisites" ADD CONSTRAINT "prerequisites_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_APClassPrerequisites" ADD CONSTRAINT "_APClassPrerequisites_A_fkey" FOREIGN KEY ("A") REFERENCES "ap_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_APClassPrerequisites" ADD CONSTRAINT "_APClassPrerequisites_B_fkey" FOREIGN KEY ("B") REFERENCES "prerequisites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_APClassGradeLevels" ADD CONSTRAINT "_APClassGradeLevels_A_fkey" FOREIGN KEY ("A") REFERENCES "ap_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_APClassGradeLevels" ADD CONSTRAINT "_APClassGradeLevels_B_fkey" FOREIGN KEY ("B") REFERENCES "grade_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreRequisiteGradeLevels" ADD CONSTRAINT "_PreRequisiteGradeLevels_A_fkey" FOREIGN KEY ("A") REFERENCES "grade_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PreRequisiteGradeLevels" ADD CONSTRAINT "_PreRequisiteGradeLevels_B_fkey" FOREIGN KEY ("B") REFERENCES "prerequisites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
