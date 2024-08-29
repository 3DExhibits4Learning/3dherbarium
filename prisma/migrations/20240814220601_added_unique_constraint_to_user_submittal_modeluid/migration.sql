/*
  Warnings:

  - A unique constraint covering the columns `[modeluid]` on the table `userSubmittal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `userSubmittal_modeluid_key` ON `userSubmittal`(`modeluid`);
