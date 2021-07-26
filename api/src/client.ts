import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export const sql: typeof db.$queryRaw = (...args) => db.$queryRaw(...args);