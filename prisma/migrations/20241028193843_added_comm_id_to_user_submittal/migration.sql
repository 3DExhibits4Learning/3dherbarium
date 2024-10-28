/*
  Warnings:

  - Made the column `url` on table `annotations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `annotations` MODIFY `url` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `userSubmittal` ADD COLUMN `communityId` VARCHAR(191) NULL;
