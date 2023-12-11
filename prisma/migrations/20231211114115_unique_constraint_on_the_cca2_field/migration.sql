/*
  Warnings:

  - A unique constraint covering the columns `[cca2]` on the table `Country` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Country_cca2_key" ON "Country"("cca2");
