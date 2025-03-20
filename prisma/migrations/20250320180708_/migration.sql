/*
  Warnings:

  - A unique constraint covering the columns `[sid]` on the table `model` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `model_sid_key` ON `model`(`sid`);
