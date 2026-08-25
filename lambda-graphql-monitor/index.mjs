import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"

const ses = new SESv2Client({ region: "us-east-1" })

const ENDPOINTS = {
    v1beta: "https://beta.pokeapi.co/graphql/v1beta",
    v1beta2: "https://graphql.pokeapi.co/v1beta2",
}

const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL
const FROM_ADDRESS = process.env.FROM_ADDRESS

export const handler = async () => {
    const results = {}

    for (const [name, url] of Object.entries(ENDPOINTS)) {
        results[name] = await checkEndpoint(name, url)
        console.log(JSON.stringify({ endpoint: name, ...results[name] }))
    }

    const failures = Object.entries(results).filter(([, r]) => !r.healthy)

    if (failures.length > 0) {
        await sendAlertEmail(failures, results)
    }

    return { checked: Object.keys(ENDPOINTS), failures: failures.map(([name]) => name) }
}

async function checkEndpoint(name, url) {
    const timestamp = new Date().toISOString()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: "{ __typename }" }),
            signal: controller.signal,
        })
        clearTimeout(timeout)

        const bodyText = await res.text()
        let parsed
        try {
            parsed = JSON.parse(bodyText)
        } catch {
            return {
                healthy: false,
                timestamp,
                reason: "invalid JSON response",
                status: res.status,
                body: bodyText.slice(0, 1000),
            }
        }

        if (!res.ok) {
            return {
                healthy: false,
                timestamp,
                reason: "non-2xx HTTP status",
                status: res.status,
                body: bodyText.slice(0, 1000),
            }
        }

        if (parsed.errors) {
            return {
                healthy: false,
                timestamp,
                reason: "GraphQL errors in 200 response",
                status: res.status,
                body: bodyText.slice(0, 1000),
            }
        }

        return { healthy: true, timestamp, status: res.status }
    } catch (err) {
        clearTimeout(timeout)
        return {
            healthy: false,
            timestamp,
            reason: err.name === "AbortError" ? "timeout" : "network error",
            error: String(err),
        }
    }
}

async function sendAlertEmail(failures, allResults) {
    if (!FROM_ADDRESS || !RECIPIENT_EMAIL) {
        throw new Error("Missing required env vars: FROM_ADDRESS and/or RECIPIENT_EMAIL")
    }

    const summary = failures
        .map(([name, r]) => `${name}: ${r.reason}${r.status ? ` (HTTP ${r.status})` : ""}`)
        .join("\n")
    const fullDetail = JSON.stringify(allResults, null, 2)

    await ses.send(
        new SendEmailCommand({
            FromEmailAddress: FROM_ADDRESS,
            Destination: { ToAddresses: [RECIPIENT_EMAIL] },
            Content: {
                Simple: {
                    Subject: { Data: `PokeAPI GraphQL check failed: ${failures.map(([n]) => n).join(", ")}` },
                    Body: { Text: { Data: `${summary}\n\nFull detail:\n${fullDetail}` } },
                },
            },
        }),
    )
}
