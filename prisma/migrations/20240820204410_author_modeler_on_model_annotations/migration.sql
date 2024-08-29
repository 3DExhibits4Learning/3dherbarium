/*
  Warnings:

  - You are about to drop the column `author` on the `model_annotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `model_annotation` DROP COLUMN `author`,
    ADD COLUMN `modeler` VARCHAR(75) NOT NULL DEFAULT 'Hunter Phillips';
