/**
 * Prisma client singleton.
 *
 * In dev, Next.js hot-reloads modules on every save, which would otherwise
 * create a brand-new PrismaClient (and a brand-new connection pool) on every
 * reload — quickly exhausting Postgres's connection limit. Stashing the
 * client on `globalThis` in non-production means hot reloads reuse the same
 * instance instead of creating a new one each time.
 *
 * `PrismaPg` is Prisma's driver adapter for `pg` — required because this
 * project uses the newer `prisma-client` generator (see schema.prisma),
 * which needs an explicit adapter rather than managing its own connection
 * internally the way the older generator did.
 */

import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient
}

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })

// Create a new Prisma client instance if one doesn't already exist, and store it in the global object
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter, log: ["error"] })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export { prisma }
