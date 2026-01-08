-- CreateEnum
CREATE TYPE "user_mission_status" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "user_gender" AS ENUM ('남성', '여성');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255),
    "gender" "user_gender" NOT NULL,
    "birth" DATE NOT NULL,
    "address" VARCHAR(255),
    "detail_address" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "nickname" VARCHAR(50),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "food_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "food_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favor_category" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "food_category_id" INTEGER,

    CONSTRAINT "user_favor_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mission" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,
    "duedate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(10) NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "rate" INTEGER NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "region_id" INTEGER NOT NULL,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_mission" (
    "id" SERIAL NOT NULL,
    "mission_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "user_mission_status",
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_mission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_favor_category_user_id_idx" ON "user_favor_category"("user_id");

-- CreateIndex
CREATE INDEX "user_favor_category_food_category_id_idx" ON "user_favor_category"("food_category_id");

-- CreateIndex
CREATE INDEX "mission_store_id_idx" ON "mission"("store_id");

-- CreateIndex
CREATE INDEX "review_store_id_idx" ON "review"("store_id");

-- CreateIndex
CREATE INDEX "review_user_id_idx" ON "review"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "name" ON "store"("name");

-- CreateIndex
CREATE INDEX "region_id" ON "store"("region_id");

-- CreateIndex
CREATE INDEX "user_mission_user_id_idx" ON "user_mission"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_user_mission" ON "user_mission"("mission_id", "user_id");

-- AddForeignKey
ALTER TABLE "user_favor_category" ADD CONSTRAINT "user_favor_category_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_favor_category" ADD CONSTRAINT "user_favor_category_ibfk_2" FOREIGN KEY ("food_category_id") REFERENCES "food_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "mission" ADD CONSTRAINT "mission_ibfk_1" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_ibfk_1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_ibfk_2" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_ibfk_1" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_mission" ADD CONSTRAINT "user_mission_ibfk_1" FOREIGN KEY ("mission_id") REFERENCES "mission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_mission" ADD CONSTRAINT "user_mission_ibfk_2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
