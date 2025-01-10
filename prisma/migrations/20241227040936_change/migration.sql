/*
  Warnings:

  - You are about to drop the column `userClasses` on the `fileWork` table. All the data in the column will be lost.
  - Added the required column `userType` to the `fileWork` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fileWork` DROP COLUMN `userClasses`,
    ADD COLUMN `userType` ENUM('SISWA', 'GURU', 'ALUMNI') NOT NULL;
