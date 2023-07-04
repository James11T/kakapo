import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      realIp: string;
      country: string;
      user: User | undefined;
      id: string;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_PORT: string;
      EMAIL_DEV_SERVER_PORT: string;
      DB_URL: string;
      NODE_ENV: string;
      DEV_SEND_EMAILS: string;
      DEV_BYPASS_AUTH: string;
      JWT_SECRET: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      MEDIA_BUCKET_NAME: string;
      MODERATION_OUTPUT_TABLE_NAME: string;
    }
  }
}

export {};
