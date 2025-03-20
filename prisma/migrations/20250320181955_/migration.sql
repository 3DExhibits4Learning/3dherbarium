/*
  Warnings:

  - A unique constraint covering the columns `[sid]` on the table `specimen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `specimen_sid_key` ON `specimen`(`sid`);
