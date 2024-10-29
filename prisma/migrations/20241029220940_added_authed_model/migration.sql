-- CreateTable
CREATE TABLE `authed` (
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
