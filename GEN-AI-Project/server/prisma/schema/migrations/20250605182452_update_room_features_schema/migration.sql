-- CreateTable
CREATE TABLE "room_features" (
    "id" SERIAL NOT NULL,
    "room_number" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "room_type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "area_sqm" DOUBLE PRECISION NOT NULL,
    "window_count" INTEGER NOT NULL,
    "has_natural_light" BOOLEAN NOT NULL,
    "has_projector" BOOLEAN NOT NULL,
    "has_microphone" BOOLEAN NOT NULL,
    "has_camera" BOOLEAN NOT NULL,
    "has_air_conditioner" BOOLEAN NOT NULL,
    "has_noise_cancelling" BOOLEAN NOT NULL,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_features_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_features_room_number_key" ON "room_features"("room_number");

-- AddForeignKey
ALTER TABLE "room_features" ADD CONSTRAINT "room_features_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
