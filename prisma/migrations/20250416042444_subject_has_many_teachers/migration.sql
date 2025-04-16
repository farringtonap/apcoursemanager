/*
  Warnings:

  - A unique constraint covering the columns `[level]` on the table `grade_levels` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "teachers_subjectId_key";

-- CreateIndex
CREATE UNIQUE INDEX "grade_levels_level_key" ON "grade_levels"("level");
