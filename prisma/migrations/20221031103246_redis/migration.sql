/*
  Warnings:

  - You are about to drop the `articles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_userId_fkey";

-- DropForeignKey
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_categoryId_fkey";

-- DropTable
DROP TABLE "articles";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "sub_categories";
