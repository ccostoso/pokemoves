/**
 * Catch-all route for every Better Auth endpoint (sign-in, sign-up, session,
 * callback routes, etc.). Better Auth defines its own internal routing, and
 * `toNextJsHandler` adapts that router into standard Next.js `GET`/`POST` 
 * route handlers. The `[...all]` segment means this single file matches every 
 * path under `/api/auth/*`, so new Better Auth endpoints don't require new 
 * discrete route files here.
 */

import { auth } from "@/lib/auth/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { POST, GET } = toNextJsHandler(auth)
