import { PrismaClient } from "@prisma/client";
import { isDevelopmentEnv } from "./config.js";
import type { Prisma } from "@prisma/client";

const loggingLevel: Prisma.LogLevel[] = isDevelopmentEnv ? ["query"] : [];

const prisma = new PrismaClient({ log: loggingLevel });

export default prisma;
