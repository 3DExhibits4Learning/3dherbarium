-- DropForeignKey
ALTER TABLE `submittalSoftware` DROP FOREIGN KEY `submittalSoftwareFk`;

-- DropForeignKey
ALTER TABLE `submittalTags` DROP FOREIGN KEY `submittalTagsFk`;

-- AddForeignKey
ALTER TABLE `submittalSoftware` ADD CONSTRAINT `submittalSoftwareFk` FOREIGN KEY (`id`) REFERENCES `userSubmittal`(`confirmation`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submittalTags` ADD CONSTRAINT `submittalTagsFk` FOREIGN KEY (`id`) REFERENCES `userSubmittal`(`confirmation`) ON DELETE CASCADE ON UPDATE CASCADE;
