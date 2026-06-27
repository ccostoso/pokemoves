import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

// This file is a singleton for the Prisma client, which is used to connect to the database.
// We use a singleton to avoid creating multiple instances of the Prisma client, which can cause
// issues with database connections.
const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient
}

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

// Create a new Prisma client instance if one doesn't already exist, and store it in the global object
const prisma =
    globalForPrisma.prisma ?? new PrismaClient({ adapter, log: ["error"] })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { prisma }
