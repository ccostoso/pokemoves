// Shared safety check so integration tests can never run migrate/truncate against a real database.
export function assertDisposableTestDatabase(databaseUrl: string) {
    const url = new URL(databaseUrl)
    const isLoopbackHost = url.hostname === "localhost" || url.hostname === "127.0.0.1"
    const dbName = url.pathname.replace(/^\//, "")
    const looksLikeTestDb = /test/i.test(dbName) // must have "test" in the name

    if (!isLoopbackHost || !looksLikeTestDb) {
        throw new Error(
            `Refusing to run integration tests against "${url.hostname}${url.pathname}". ` +
                'DATABASE_URL must point at a loopback host (localhost/127.0.0.1) with "test" in the ' +
                "database name, to avoid running migrations/truncation against a real database. " +
                "Use .env.test or override DATABASE_URL with a disposable test database.",
        )
    }
}
