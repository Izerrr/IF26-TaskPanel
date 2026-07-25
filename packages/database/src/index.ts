import { PrismaClient } from "@prisma/client";

// Singleton pattern — required so Next.js dev hot-reload (and serverless
// cold starts on Vercel) don't spawn a fresh PrismaClient per request,
// which is exactly the connection-exhaustion problem RULES.md #1 warns about.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
