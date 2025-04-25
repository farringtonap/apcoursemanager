/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ap_classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ap_classes_name_key" ON "ap_classes"("name");
