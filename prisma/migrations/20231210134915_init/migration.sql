-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "languages" TEXT[],
    "cca2" TEXT NOT NULL,
    "cca3" TEXT NOT NULL,
    "ccn3" INTEGER NOT NULL,
    "currencies" JSONB NOT NULL,
    "region" TEXT NOT NULL,
    "latlng" DECIMAL(65,30)[],

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);
