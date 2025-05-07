declare module '*/envconfig.js' {
  interface ServerConfig {
    port: number;
    hostname: string;
    wsPort: number;
    nodeEnv: string;
    frontendUrl: string;
  }

  interface AppConfig {
    name: string;
  }

  interface DbConfig {
    url: string;
  }

  interface RedisConfig {
    host: string;
    port: number;
    password: string;
  }

  interface JwtConfig {
    secret: string;
    refreshSecret: string;
  }

  interface CryptoConfig {
    mfaSecretKey: string;
  }

  interface SmtpConfig {
    service: string;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
  }

  interface TelegramConfig {
    botToken: string;
    webhookUrl: string;
  }

  export interface Config {
    server: ServerConfig;
    app: AppConfig;
    db: DbConfig;
    redis: RedisConfig;
    jwt: JwtConfig;
    crypto: CryptoConfig;
    smtp: SmtpConfig;
    telegram: TelegramConfig;
  }

  export const config: Config;
}
