-- AlterTable
ALTER TABLE `model` ADD COLUMN `lat` VARCHAR(25) NULL,
    ADD COLUMN `lng` VARCHAR(25) NULL,
    ADD COLUMN `locality` VARCHAR(1500) NULL;