type VerificationEmailTemplate = {
    subject: string,
    html: string,
    text: string
}

export function buildVerificationEmail(url: string): VerificationEmailTemplate {
    const subject = "Verify your email"

    const html = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Verify Your Email</title>
    </head>
    <body style="margin:0;padding:24px;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
                <td style="padding:24px 24px 8px 24px;">
                    <h1 style="margin:0;font-size:22px;line-height:1.25;color:#111827;">Verify your email</h1>
                </td>
            </tr>
            <tr>
                <td style="padding:8px 24px 0 24px;font-size:15px;line-height:1.6;color:#374151;">
                    Thanks for signing up for Pokemoves. Confirm your email address to activate your account.
                </td>
            </tr>
            <tr>
                <td style="padding:24px;">
                    <a href="${url}" style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;line-height:1;padding:12px 16px;border-radius:8px;">Verify email</a>
                </td>
            </tr>
            <tr>
                <td style="padding:0 24px 16px 24px;font-size:13px;line-height:1.6;color:#6b7280;">
                    If the button does not work, copy and paste this link into your browser:
                    <br />
                    <a href="${url}" style="color:#2563eb;word-break:break-all;">${url}</a>
                </td>
            </tr>
            <tr>
                <td style="padding:0 24px 24px 24px;font-size:12px;line-height:1.6;color:#9ca3af;">
                    If you did not create an account, you can safely ignore this email.
                </td>
            </tr>
        </table>
    </body>
</html>
    `

    const text = [
        "Verify your email",
        "",
        "Thanks for signing up for Pokemoves. Confirm your email address to activate your account.",
        "",
        `Verification link: ${url}`,
        "",
        "If you did not create an account, you can safely ignore this email.",
    ].join("\\n")

    return {
        subject,
        html,
        text,
    }
}
