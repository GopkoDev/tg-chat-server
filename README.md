# TG Chat Server

Server part of the Telegram chat application.

## Deploying on Dokploy

### Requirements

- Docker
- Dokploy (installed and configured)

### Deployment Steps

1. Clone the repository:

```
git clone [your-repository-url]
cd tg-chat-server
```

2. Create an .env file

3. Edit the .env file and specify your own settings:

```
nano .env
```

4. Start deployment via dokploy:

```
dokploy up
```

5. After completion, your server will be deployed and available according to the specified configuration.

## Development

### Running in Development Mode

```
npm install
npm run dev
```

### Running Tests

```
npm test
```

## Commands

- `npm run dev` - Start the server in development mode
- `npm run dev-db` - Start the database and server in development mode
- `npm run test` - Run tests
- `npm run build` - Build the project (generate Prisma client)
- `npm run start` - Start the server in production mode

## Technologies

- Node.js
- Hono
- Prisma
- PostgreSQL
- Redis
