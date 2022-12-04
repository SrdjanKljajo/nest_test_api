/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "files_userId_key" ON "files"("userId");
