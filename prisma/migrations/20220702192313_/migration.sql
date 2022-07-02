/*
  Warnings:

  - You are about to drop the column `available` on the `Bike` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `BikeRating` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `BikeReservation` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `BikeReservation` table. All the data in the column will be lost.
  - Added the required column `date` to the `BikeReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bike" DROP COLUMN "available";

-- AlterTable
ALTER TABLE "BikeRating" DROP COLUMN "comment";

-- AlterTable
ALTER TABLE "BikeReservation" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
