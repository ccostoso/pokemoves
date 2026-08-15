# Pokémoves

A full-stack Pokémon moveset explorer, letting users compare when Pokémon learn each move across game generations, and save research to a personal account.

**Live:** [pokemoves.costo.so](https://pokemoves.costo.so)

## Stack

**App**

- [Next.js 16](https://nextjs.org) (App Router) + React 19, TypeScript
- [Prisma 7](https://www.prisma.io) + PostgreSQL
- [Better Auth](https://www.better-auth.com) for authentication
- [Resend](https://resend.com) for transactional email
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix/Base UI primitives)
- [`@dnd-kit`](https://dndkit.com) for drag-and-drop deck building
- Data fetched from [PokeAPI](https://pokeapi.co)'s GraphQL endpoint via `graphql-request`

**Testing**

- [Vitest](https://vitest.dev) for unit tests (mocked/isolated) and a separate integration suite (runs against a real Postgres instance)
- React Testing Library + jsdom

**Infrastructure**

- Docker (multi-stage build, `next.config.ts`'s `output: "standalone"` for a slim runtime image)
- AWS ECS on Fargate, behind an Application Load Balancer
- AWS ECR for image storage
- AWS SSM Parameter Store for secrets (database URL, auth secret, email API key)
- GitHub Actions for CI and deployment, authenticated to AWS via OIDC and with no long-lived AWS credentials stored in CI

## Architecture

```
GitHub push to main
       │
       ▼
   CI workflow (lint, typecheck, unit + integration tests, build)
       │  (on success)
       ▼
   Deploy workflow
       │  build image → push to ECR → run prisma migrate deploy
       │  → render new ECS task definition → deploy to service
       ▼
Application Load Balancer → ECS Service (Fargate tasks) → PostgreSQL
```

CI and deploy are two separate GitHub Actions workflows, not one. `deploy.yml` triggers on a `workflow_run` event tied to `ci.yml`'s completion, and only proceeds if CI succeeded. It then checks out the _exact commit SHA_ CI validated (`github.event.workflow_run.head_sha`), rather than re-checking out `main`'s current tip. This guarantees the code that gets deployed is byte-for-byte what was tested, even if someone pushes again while a deploy is in flight.

## Local development

**1. Environment variables**: copy the example file and fill in real values:

```bash
cp .env.example .env
```

**2. Start Postgres and the app together** via Docker Compose:

```bash
docker compose up
```

This runs (and wires together) a local Postgres container and the app itself. The app connects to Postgres over the Docker network, matching how it runs in production, just without ECS/Fargate in between.

Alternatively, run the app directly against any Postgres instance (local or otherwise) by setting `DATABASE_URL` in `.env` and skipping Compose:

```bash
pnpm install
pnpm prisma generate
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

**Note on Prisma's client output:** as of Prisma 7, the generator block requires an explicit `output` path. Prisma no longer generates the client into `node_modules` by default at all. This project generates to `../generated/prisma`. As a result, `prisma generate` must run as its own explicit step: it's not a side effect of `pnpm install` the way it could be under Prisma's older, implicit `node_modules` behavior. Both the `build` script and the Dockerfile call it explicitly for this reason.

## Testing

```bash
pnpm test                  # unit tests
pnpm test:integration      # integration tests, requires a real Postgres connection
pnpm test:coverage         # unit tests with coverage report
```

Integration tests exercise real-world database behavior (via `vitest.integration.config.mts`) rather than mocking the data layer. The CI workflow spins up a genuine Postgres service container for this rather than stubbing it out, so what passes in CI reflects real query/migration behavior, not mocked assumptions.

## Notable technical decisions

Some of the choices made in this codebase aren't obvious from the code alone. Here's what to know:

**Migrations run via `prisma migrate deploy` in the deploy pipeline, not `prisma db push`.** `db push` syncs schema directly with no migration history, so changes aren't tracked, reviewable or (safely) reversible. `migrate deploy` applies the same versioned migration files (`prisma/migrations/`) that get generated and reviewed locally, so what runs in production is an audited, ordered history rather than an ad hoc sync.

**The Dockerfile explicitly copies `generated/prisma` into the final runtime image**, separate from the standalone build's automatic dependency tracing. Next.js's `output: "standalone"` mode traces the actual runtime import graph and only copies what it detects, but Prisma's query engine binary is loaded dynamically at runtime rather than through a static `import`, so standalone tracing misses it. Without a copy, the container builds and starts, then fails the moment it tries to touch the database.

**`serverExternalPackages: ["@prisma/client", "pg"]`** in `next.config.ts` keeps these two packages out of Next's own bundling. Both ship native bindings that won't survive being bundled the way pure-JS dependencies do.

**Deployment authenticates to AWS via OIDC**, not stored access keys. GitHub issues a short-lived identity token per deployment and an IAM role's trust policy verifies that token before handing out temporary credentials scoped to that run. There's no long-lived AWS secret sitting in GitHub for the deploy job to leak.

**The image is built for `linux/amd64` explicitly** (`docker buildx build --platform linux/amd64`), regardless of what architecture the CI runner itself is. Fargate tasks run on x86_64, and a locally-built ARM image (e.g. from Apple Silicon) would fail to start with an `exec format error` if pushed without it.

## Scripts

| Command                         | Does                                            |
| ------------------------------- | ----------------------------------------------- |
| `pnpm dev`                      | Start the dev server                            |
| `pnpm build`                    | `prisma generate` + `next build`                |
| `pnpm start`                    | Run the production build                        |
| `pnpm lint` / `pnpm lint:fix`   | ESLint                                          |
| `pnpm typecheck`                | `tsc --noEmit`                                  |
| `pnpm test` / `pnpm test:watch` | Unit tests                                      |
| `pnpm test:integration`         | Integration tests (needs a real `DATABASE_URL`) |
| `pnpm studio`                   | Prisma Studio (opens in Chrome)                 |
