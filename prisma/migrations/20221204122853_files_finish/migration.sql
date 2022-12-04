/*
  Warnings:

  - You are about to drop the column `userId` on the `files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_userId_fkey";

-- DropIndex
DROP INDEX "files_userId_key";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "userId";
