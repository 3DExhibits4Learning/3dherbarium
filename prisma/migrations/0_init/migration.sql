-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `accounts_user_id_fkey`(`user_id`),
    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annotations` (
    `url` VARCHAR(1000) NOT NULL,
    `uid` VARCHAR(100) NOT NULL,
    `annotation_no` TINYINT NOT NULL,
    `annotation_type` CHAR(5) NOT NULL,
    `annotation_id` VARCHAR(36) NOT NULL,

    INDEX `uid`(`uid`),
    PRIMARY KEY (`annotation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `common_names` (
    `spec_name` VARCHAR(100) NOT NULL,
    `common_name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`spec_name`, `common_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_set` (
    `spec_name` VARCHAR(100) NOT NULL,
    `spec_acquis_date` DATE NOT NULL,
    `set_no` TINYINT NOT NULL,
    `imaged_by` VARCHAR(25) NOT NULL,
    `imaged_date` DATE NOT NULL,
    `images_link` VARCHAR(100) NULL,
    `no_of_images` SMALLINT NOT NULL,
    `uid` VARCHAR(100) NULL,

    INDEX `image_set_ibfk_2`(`spec_acquis_date`, `spec_name`),
    INDEX `spec_acquis_date`(`spec_acquis_date`),
    INDEX `uid`(`uid`),
    PRIMARY KEY (`spec_name`, `spec_acquis_date`, `set_no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model` (
    `uid` VARCHAR(100) NOT NULL,
    `spec_name` VARCHAR(100) NOT NULL,
    `spec_acquis_date` DATE NOT NULL,
    `modeled_by` VARCHAR(25) NOT NULL,
    `site_ready` BOOLEAN NOT NULL DEFAULT false,
    `pref_comm_name` VARCHAR(100) NOT NULL DEFAULT '',
    `base_model` BOOLEAN NULL DEFAULT true,
    `annotated` BOOLEAN NULL DEFAULT false,
    `annotation` VARCHAR(4000) NULL,
    `build_process` VARCHAR(50) NULL DEFAULT 'Photogrammetry',

    INDEX `model_ibfk_2`(`spec_acquis_date`, `spec_name`),
    INDEX `spec_acquis_date`(`spec_acquis_date`),
    INDEX `spec_name`(`spec_name`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photo_annotation` (
    `url` VARCHAR(1000) NOT NULL,
    `website` VARCHAR(150) NULL,
    `author` VARCHAR(75) NOT NULL,
    `title` VARCHAR(100) NULL,
    `license` VARCHAR(75) NOT NULL,
    `annotator` VARCHAR(25) NOT NULL,
    `annotation` VARCHAR(4000) NOT NULL,
    `annotation_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annotation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    INDEX `sessions_user_id_fkey`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `software` (
    `uid` VARCHAR(100) NOT NULL,
    `software` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`uid`, `software`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `species` (
    `spec_name` VARCHAR(100) NOT NULL,
    `genus` VARCHAR(50) NOT NULL,
    `is_local` BOOLEAN NOT NULL,

    PRIMARY KEY (`spec_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `specimen` (
    `spec_name` VARCHAR(100) NOT NULL,
    `spec_acquis_date` DATE NOT NULL,
    `procurer` VARCHAR(25) NOT NULL,

    INDEX `spec_acquis_date`(`spec_acquis_date`),
    INDEX `spec_name`(`spec_name`),
    PRIMARY KEY (`spec_name`, `spec_acquis_date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submittalAttempt` (
    `attemptuid` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `dateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `errorCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`attemptuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submittalSoftware` (
    `id` VARCHAR(191) NOT NULL,
    `software` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`, `software`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submittalTags` (
    `id` VARCHAR(191) NOT NULL,
    `tag` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`, `tag`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userSubmittal` (
    `confirmation` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `artistName` VARCHAR(191) NOT NULL,
    `speciesName` VARCHAR(191) NOT NULL,
    `createdWithMobile` BOOLEAN NOT NULL,
    `methodology` VARCHAR(191) NOT NULL,
    `dateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `modeluid` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `thumbnail` VARCHAR(191) NOT NULL,
    `lat` DECIMAL(65, 30) NOT NULL,
    `lng` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`confirmation`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `email_verified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verificationtokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verificationtokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video_annotation` (
    `url` VARCHAR(1000) NOT NULL,
    `length` VARCHAR(4) NULL,
    `annotation_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`annotation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annotations` ADD CONSTRAINT `annotations_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `model`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `common_names` ADD CONSTRAINT `common_names_ibfk_1` FOREIGN KEY (`spec_name`) REFERENCES `species`(`spec_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image_set` ADD CONSTRAINT `image_set_ibfk_1` FOREIGN KEY (`spec_name`) REFERENCES `species`(`spec_name`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `image_set` ADD CONSTRAINT `image_set_ibfk_2` FOREIGN KEY (`spec_acquis_date`, `spec_name`) REFERENCES `specimen`(`spec_acquis_date`, `spec_name`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `image_set` ADD CONSTRAINT `image_set_ibfk_3` FOREIGN KEY (`uid`) REFERENCES `model`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `model` ADD CONSTRAINT `model_ibfk_1` FOREIGN KEY (`spec_name`) REFERENCES `species`(`spec_name`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `model` ADD CONSTRAINT `model_ibfk_2` FOREIGN KEY (`spec_acquis_date`, `spec_name`) REFERENCES `specimen`(`spec_acquis_date`, `spec_name`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photo_annotation` ADD CONSTRAINT `photoFk1` FOREIGN KEY (`annotation_id`) REFERENCES `annotations`(`annotation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `software` ADD CONSTRAINT `software_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `model`(`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `specimen` ADD CONSTRAINT `specimen_ibfk_1` FOREIGN KEY (`spec_name`) REFERENCES `species`(`spec_name`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submittalSoftware` ADD CONSTRAINT `submittalSoftwareFk` FOREIGN KEY (`id`) REFERENCES `userSubmittal`(`confirmation`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submittalTags` ADD CONSTRAINT `submittalTagsFk` FOREIGN KEY (`id`) REFERENCES `userSubmittal`(`confirmation`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video_annotation` ADD CONSTRAINT `videoFk1` FOREIGN KEY (`annotation_id`) REFERENCES `annotations`(`annotation_id`) ON DELETE CASCADE ON UPDATE CASCADE;

