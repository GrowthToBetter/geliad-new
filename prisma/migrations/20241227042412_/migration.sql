/*
  Warnings:

  - You are about to alter the column `clasess` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `clasess` ENUM('SISWA', 'GURU', 'ALUMNI') NULL;
