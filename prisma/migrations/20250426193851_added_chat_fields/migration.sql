-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('PRIVATE', 'GROUP');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "telegram_chat_id" TEXT,
ADD COLUMN     "type" "ChatType" NOT NULL DEFAULT 'PRIVATE';
