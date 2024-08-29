/*
  Warnings:

  - You are about to drop the column `provider_account_id` on the `accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `accounts_provider_provider_account_id_key` ON `accounts`;

-- AlterTable
ALTER TABLE `accounts` DROP COLUMN `provider_account_id`,
    ADD COLUMN `providerAccountId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `accounts_provider_providerAccountId_key` ON `accounts`(`provider`, `providerAccountId`);
