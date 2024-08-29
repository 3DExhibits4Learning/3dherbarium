-- AlterTable
ALTER TABLE `annotations` ADD COLUMN `position` VARCHAR(250) NULL;

-- AlterTable
ALTER TABLE `model` ADD COLUMN `annotationPosition` VARCHAR(250) NULL;
