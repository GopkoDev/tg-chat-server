import { Server } from 'socket.io';
import type { Server as HttpServer } from 'node:http';
import logger from './logger.js';
import { config } from '../../envconfig.js';
import type { Message, MessageReaction, Contact, User } from '@prisma/client';

export enum SocketEvents {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect',
  NEW_MESSAGE = 'new_message',
  NEW_USER = 'new_user',
  NEW_REACTION = 'new_reaction',
  READ_MESSAGES = 'read_messages',
}

export interface MessagePayload {
  chatId: string;
  message: Message & {
    reactions: Array<
      MessageReaction & {
        user?: Pick<User, 'id' | 'name' | 'photoUrl'> | null;
        contact?: Pick<
          Contact,
          'id' | 'firstName' | 'lastName' | 'photoUrl'
        > | null;
      }
    >;
  };
}

export interface UserPayload {
  user: {
    id: string;
    firstName: string;
    lastName?: string | null;
    userName?: string | null;
    photoUrl?: string | null;
  };
}

export interface ReactionPayload {
  messageId: string;
  reaction: MessageReaction & {
    user?: Pick<User, 'id' | 'name' | 'photoUrl'> | null;
    contact?: Pick<
      Contact,
      'id' | 'firstName' | 'lastName' | 'photoUrl'
    > | null;
  };
}

export interface ReadMessagesPayload {
  chatId: string;
}

class SocketService {
  private io: Server | null = null;

  initializeSocket(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: config.server.frontendUrl,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.on(SocketEvents.CONNECTION, (socket) => {
      logger.info(`WS: User connected: ${socket.id}`);

      socket.on(SocketEvents.DISCONNECT, () => {
        logger.info(`WS: User disconnected: ${socket.id}`);
      });
    });

    logger.info('WS: Socket.IO initialized');
  }

  emitNewMessage(payload: MessagePayload): void {
    if (!this.io) {
      logger.error('WS: Socket.IO not initialized');
      return;
    }
    this.io.emit(SocketEvents.NEW_MESSAGE, payload);
    logger.info(`WS: New message emitted to all users: ${payload.chatId}`);
  }

  emitNewUser(payload: UserPayload): void {
    if (!this.io) {
      logger.error('WS: Socket.IO not initialized');
      return;
    }
    this.io.emit(SocketEvents.NEW_USER, payload);
    logger.info('WS: New user emitted to all users');
  }

  emitNewReaction(payload: ReactionPayload): void {
    if (!this.io) {
      logger.error('WS: Socket.IO not initialized');
      return;
    }
    this.io.emit(SocketEvents.NEW_REACTION, payload);
    logger.info(`WS: New reaction emitted to all users: ${payload.messageId}`);
  }

  emitReadMessages(payload: ReadMessagesPayload): void {
    if (!this.io) {
      logger.error('WS: Socket.IO not initialized');
      return;
    }
    this.io.emit(SocketEvents.READ_MESSAGES, payload);
    logger.info(`WS: Read messages emitted to all users: ${payload.chatId}`);
  }
}

export const socketService = new SocketService();
