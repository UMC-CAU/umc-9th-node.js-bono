/*
  Warnings:

  - Made the column `content` on table `mission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reward` on table `mission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duedate` on table `mission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `mission` MODIFY `content` TEXT NOT NULL,
    MODIFY `reward` INTEGER NOT NULL,
    MODIFY `duedate` DATETIME(0) NOT NULL;
