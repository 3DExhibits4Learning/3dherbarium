-- AlterTable
ALTER TABLE `image_set` ADD COLUMN `sid` VARCHAR(36) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `model` ADD COLUMN `sid` VARCHAR(36) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `specimen` ALTER COLUMN `sid` DROP DEFAULT;
