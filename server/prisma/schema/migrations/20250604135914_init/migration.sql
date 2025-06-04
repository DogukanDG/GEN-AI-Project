/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "Reservation" (
    "reservation_id" SERIAL NOT NULL,
    "room_number" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "start_datetime" TIMESTAMP(3) NOT NULL,
    "end_datetime" TIMESTAMP(3) NOT NULL,
    "booking_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("reservation_id")
);

-- CreateTable
CREATE TABLE "Room" (
    "room_id" SERIAL NOT NULL,
    "room_number" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "room_type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "area_sqm" DOUBLE PRECISION NOT NULL,
    "chair_count" INTEGER NOT NULL,
    "window_count" INTEGER NOT NULL,
    "has_natural_light" BOOLEAN NOT NULL,
    "has_projector" BOOLEAN NOT NULL,
    "has_microphone" BOOLEAN NOT NULL,
    "has_camera" BOOLEAN NOT NULL,
    "has_air_conditioner" BOOLEAN NOT NULL,
    "has_noise_cancelling" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("room_id")
);

-- CreateIndex
CREATE INDEX "Reservation_room_number_idx" ON "Reservation"("room_number");

-- CreateIndex
CREATE INDEX "Reservation_user_id_idx" ON "Reservation"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Room_room_number_key" ON "Room"("room_number");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_room_number_fkey" FOREIGN KEY ("room_number") REFERENCES "Room"("room_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
