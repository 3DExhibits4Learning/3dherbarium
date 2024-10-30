/*
  Warnings:

  - You are about to alter the column `communityId` on the `userSubmittal` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `userSubmittal` MODIFY `communityId` INTEGER NULL;
