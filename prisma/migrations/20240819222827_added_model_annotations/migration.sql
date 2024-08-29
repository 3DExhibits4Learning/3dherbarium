-- CreateTable
CREATE TABLE `model_annotation` (
    `url` VARCHAR(1000) NOT NULL,
    `author` VARCHAR(75) NOT NULL,
    `license` VARCHAR(75) NOT NULL,
    `annotator` VARCHAR(25) NOT NULL,
    `annotation` VARCHAR(4000) NOT NULL,
    `annotation_id` VARCHAR(36) NOT NULL,
    `uid` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `model_annotation_uid_key`(`uid`),
    PRIMARY KEY (`annotation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `model_annotation` ADD CONSTRAINT `modelAnnotationFk2` FOREIGN KEY (`uid`) REFERENCES `model`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `model_annotation` ADD CONSTRAINT `modelAnnotationFk1` FOREIGN KEY (`annotation_id`) REFERENCES `annotations`(`annotation_id`) ON DELETE CASCADE ON UPDATE CASCADE;
