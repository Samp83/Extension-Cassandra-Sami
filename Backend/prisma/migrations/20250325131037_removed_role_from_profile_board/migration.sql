/*
  Warnings:

  - You are about to drop the column `role` on the `profileboards` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Element_boardId_fkey` ON `element`;

-- DropIndex
DROP INDEX `ProfileBoards_boardId_fkey` ON `profileboards`;

-- AlterTable
ALTER TABLE `profileboards` DROP COLUMN `role`;

-- AddForeignKey
ALTER TABLE `ProfileBoards` ADD CONSTRAINT `ProfileBoards_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfileBoards` ADD CONSTRAINT `ProfileBoards_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Boards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Element` ADD CONSTRAINT `Element_boardId_fkey` FOREIGN KEY (`boardId`) REFERENCES `Boards`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
