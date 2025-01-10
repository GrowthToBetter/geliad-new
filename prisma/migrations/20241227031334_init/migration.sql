-- CreateTable
CREATE TABLE `User` (
    `user_id` CHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `photo_profile` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `clasess` VARCHAR(191) NULL,
    `absent` VARCHAR(191) NULL,
    `Phone` VARCHAR(191) NULL,
    `role` ENUM('SISWA', 'GURU', 'ADMIN', 'VALIDATOR', 'DELETE') NOT NULL DEFAULT 'SISWA',
    `gender` ENUM('Male', 'Female') NULL DEFAULT 'Male',
    `generation` VARCHAR(191) NULL,
    `cover` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fileWork` (
    `file_id` CHAR(36) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `userClasses` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'VERIFIED', 'DENIED') NOT NULL DEFAULT 'PENDING',
    `userId` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `coverFile` VARCHAR(191) NULL,
    `genre` VARCHAR(191) NOT NULL,
    `Like` INTEGER NOT NULL DEFAULT 0,
    `views` INTEGER NOT NULL DEFAULT 0,
    `userRole` ENUM('SISWA', 'GURU', 'ADMIN', 'VALIDATOR', 'DELETE') NOT NULL DEFAULT 'SISWA',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `comment_id` CHAR(36) NOT NULL,
    `Text` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `fileId` VARCHAR(191) NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Genre` (
    `comment_id` CHAR(36) NOT NULL,
    `Genre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classes` (
    `classes` CHAR(36) NOT NULL,
    `class` VARCHAR(191) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`classes`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAuth` (
    `userauth_id` CHAR(36) NOT NULL,
    `password` VARCHAR(191) NULL,
    `last_login` DATETIME(3) NULL,
    `userEmail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserAuth_userEmail_key`(`userEmail`),
    PRIMARY KEY (`userauth_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fileWork` ADD CONSTRAINT `fileWork_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `fileWork`(`file_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAuth` ADD CONSTRAINT `UserAuth_userEmail_fkey` FOREIGN KEY (`userEmail`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;
