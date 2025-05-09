/*
  Warnings:

  - A unique constraint covering the columns `[messageId,contactId,emoji]` on the table `MessageReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MessageReaction" ADD COLUMN     "contactId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_contactId_emoji_key" ON "MessageReaction"("messageId", "contactId", "emoji");

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
