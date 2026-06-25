import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
    database: new Pool({
        // connection options
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,

})