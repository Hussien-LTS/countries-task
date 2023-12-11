/*
  Warnings:

  - You are about to drop the column `name` on the `Country` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Country" DROP COLUMN "name",
ADD COLUMN     "common_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "official_name" TEXT NOT NULL DEFAULT '';
