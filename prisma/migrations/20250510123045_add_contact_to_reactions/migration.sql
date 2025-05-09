-- Додаємо поле contactId до таблиці MessageReaction
ALTER TABLE "MessageReaction" ADD COLUMN "contactId" TEXT;

-- Створюємо зовнішній ключ для contactId
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Створюємо унікальний індекс для комбінації messageId-contactId-emoji
CREATE UNIQUE INDEX "MessageReaction_messageId_contactId_emoji_key" ON "MessageReaction"("messageId", "contactId", "emoji"); 