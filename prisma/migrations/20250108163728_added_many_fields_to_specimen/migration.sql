-- AlterTable
ALTER TABLE `specimen` ADD COLUMN `height` VARCHAR(50) NOT NULL DEFAULT '',
    ADD COLUMN `lat` VARCHAR(50) NOT NULL DEFAULT '',
    ADD COLUMN `lng` VARCHAR(50) NOT NULL DEFAULT '',
    ADD COLUMN `locality` VARCHAR(1000) NOT NULL DEFAULT '',
    ADD COLUMN `photoUrl` VARCHAR(150) NOT NULL DEFAULT '',
    ADD COLUMN `sid` VARCHAR(25) NOT NULL DEFAULT '';
