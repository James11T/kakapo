-- CreateTable
CREATE TABLE `comment` (
    `id` VARCHAR(36) NOT NULL,
    `text` VARCHAR(1024) NOT NULL,
    `postedAt` DATETIME(0) NOT NULL,
    `authorId` VARCHAR(36) NOT NULL,
    `postId` VARCHAR(36) NOT NULL,

    INDEX `comment_authorId_idx`(`authorId`),
    INDEX `comment_postId_idx`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friendship` (
    `userFromId` VARCHAR(36) NOT NULL,
    `userToId` VARCHAR(36) NOT NULL,
    `sentAt` DATETIME(0) NOT NULL,
    `acceptedAt` DATETIME(0) NULL,
    `accepted` TINYINT NOT NULL DEFAULT 0,

    INDEX `friendship_userToId_idx`(`userToId`),
    PRIMARY KEY (`userFromId`, `userToId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post` (
    `id` VARCHAR(36) NOT NULL,
    `caption` VARCHAR(400) NOT NULL,
    `postedAt` DATETIME(0) NOT NULL,
    `authorId` VARCHAR(36) NOT NULL,

    INDEX `post_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `post_media` (
    `id` VARCHAR(36) NOT NULL,
    `url` VARCHAR(256) NOT NULL,
    `type` VARCHAR(32) NOT NULL,
    `index` INTEGER NOT NULL,
    `postId` VARCHAR(36) NOT NULL,

    INDEX `post_media_postId_idx`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` VARCHAR(336) NOT NULL,
    `subjectId` VARCHAR(36) NOT NULL,
    `expiresAt` DATETIME(0) NOT NULL,
    `issuedAt` DATETIME(0) NOT NULL,
    `deviceType` VARCHAR(64) NOT NULL DEFAULT 'unknown',
    `sourceIp` VARCHAR(39) NOT NULL,
    `isRevoked` TINYINT NOT NULL DEFAULT 0,

    INDEX `refresh_token_subjectId_idx`(`subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(36) NOT NULL,
    `username` VARCHAR(32) NOT NULL,
    `displayName` VARCHAR(32) NOT NULL,
    `avatar` VARCHAR(255) NULL,
    `about` VARCHAR(2000) NOT NULL DEFAULT '',
    `email` VARCHAR(255) NOT NULL,
    `emailVerified` TINYINT NOT NULL DEFAULT 0,
    `registeredAt` DATETIME NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_totp` (
    `id` VARCHAR(36) NOT NULL,
    `activated` TINYINT NOT NULL DEFAULT 0,
    `secret` VARCHAR(128) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,

    INDEX `user_totp_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `friendship` ADD CONSTRAINT `friendship_userToId_fkey` FOREIGN KEY (`userToId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `friendship` ADD CONSTRAINT `friendship_userFromId_fkey` FOREIGN KEY (`userFromId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `post_media` ADD CONSTRAINT `post_media_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_totp` ADD CONSTRAINT `user_totp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
