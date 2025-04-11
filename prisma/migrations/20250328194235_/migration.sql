/*
  Warnings:

  - A unique constraint covering the columns `[uid,annotation_no]` on the table `annotations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `annotations_uid_annotation_no_key` ON `annotations`(`uid`, `annotation_no`);
