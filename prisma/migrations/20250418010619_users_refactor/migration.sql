/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `teacherId` on the `ap_classes` table. All the data in the column will be lost.
  - You are about to drop the `teachers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[teacherEmail]` on the table `ap_classes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherEmail` to the `ap_classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('TEACHER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'TEACHER';
COMMIT;

-- DropForeignKey
ALTER TABLE "ap_classes" DROP CONSTRAINT "ap_classes_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_subjectId_fkey";

-- DropIndex
DROP INDEX "ap_classes_teacherId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'TEACHER';

-- AlterTable
ALTER TABLE "ap_classes" DROP COLUMN "teacherId",
ADD COLUMN     "teacherEmail" TEXT NOT NULL;

-- DropTable
DROP TABLE "teachers";

-- CreateIndex
CREATE UNIQUE INDEX "ap_classes_teacherEmail_key" ON "ap_classes"("teacherEmail");

-- AddForeignKey
ALTER TABLE "ap_classes" ADD CONSTRAINT "ap_classes_teacherEmail_fkey" FOREIGN KEY ("teacherEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
