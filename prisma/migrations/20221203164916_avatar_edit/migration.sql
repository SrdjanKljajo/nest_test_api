/*
  Warnings:

  - You are about to drop the column `url` on the `avatars` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `avatars` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `avatars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `avatars` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_userId_fkey";

-- DropIndex
DROP INDEX "avatars_userId_key";

-- AlterTable
ALTER TABLE "avatars" DROP COLUMN "url",
DROP COLUMN "userId",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL;
