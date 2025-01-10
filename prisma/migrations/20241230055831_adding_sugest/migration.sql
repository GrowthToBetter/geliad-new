-- AlterTable
ALTER TABLE `comment` ADD COLUMN `fileSugestId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_fileSugestId_fkey` FOREIGN KEY (`fileSugestId`) REFERENCES `fileWork`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;
