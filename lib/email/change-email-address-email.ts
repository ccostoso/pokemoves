/**
 * This file contains functions to build email templates for changing a user's email address. The emails are sent 
 * to the user to confirm their email change request and to verify their new email address. The emails include both 
 * HTML and plain text versions for compatibility with different email clients.
 *
 * The `buildChangeEmailAddressEmail()` function creates an email template for confirming the email change request, 
 * while the `buildEmailChangeVerificationEmail()` function creates an email template for verifying the new email 
 * address. Both functions take in the necessary parameters to customize the email content and return an object 
 * containing the subject, HTML, and plain text versions of the email.
 *
 * The first email that a user will receive in this process is the `buildChangeEmailAddressEmail` email, which is 
 * sent to the user's current email address.
 */

import { EmailTemplate } from "../types"

export function buildChangeEmailAddressEmail(url: string, currentEmail: string, newEmail: string): EmailTemplate {
    const subject = "Confirm your email change request"

    const html = `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Confirm Email Change</title>
        </head>
        <body style="margin:0;padding:24px;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                <tr>
                    <td style="padding:24px 24px 8px 24px;">
                        <h1 style="margin:0;font-size:22px;line-height:1.25;color:#111827;">Confirm your email change</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 24px 0 24px;font-size:15px;line-height:1.6;color:#374151;">
                        We received a request to change your Pokémoves account email from <strong>${currentEmail}</strong> to <strong>${newEmail}</strong>.
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 24px 0 24px;font-size:15px;line-height:1.6;color:#ff2400;">
                        NOTE: Once you confirm this change, a <span style="font-weight:bold;">second email</span> will be sent to <strong>${newEmail}</strong> to verify it. Please check your inbox and follow the instructions in that email to complete the change. The change will not be finalized until the new email address is verified.
                    </td>
                </tr>
                <tr>
                    <td style="padding:24px;">
                        <a href="${url}" style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;line-height:1;padding:12px 16px;border-radius:8px;">Confirm email change</a>
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
                        If you did not request this change, you can safely ignore this email.
                    </td>
                </tr>
            </table>
        </body>
    </html>
                        `

    const text = [
        "We received a request to change your Pokémoves account email.",
        "",
        `Current email: ${currentEmail}`,
        `New email: ${newEmail}`,
        "",
        "NOTE: Once you confirm this change, a second email will be sent to the new email address to verify it. Please check your inbox and follow the instructions in that email to complete the change. The change will not be finalized until the new email address is verified.",
        "",
        "Confirm the change using this link:",
        url,
        "",
        "If you did not request this change, you can ignore this email.",
    ].join("\n")

    return {
        subject,
        html,
        text,
    }
}

export function buildEmailChangeVerificationEmail(url: string, newEmail: string): EmailTemplate {
    const subject = "Confirm your new email address"

    const html = `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Confirm Your New Email</title>
        </head>
        <body style="margin:0;padding:24px;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                <tr>
                    <td style="padding:24px 24px 8px 24px;">
                        <h1 style="margin:0;font-size:22px;line-height:1.25;color:#111827;">Confirm your new email address</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 24px 0 24px;font-size:15px;line-height:1.6;color:#374151;">
                        You requested to change your Pokémoves account email to <strong>${newEmail}</strong>. Click below to confirm this address.
                    </td>
                </tr>
                <tr>
                    <td style="padding:24px;">
                        <a href="${url}" style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;line-height:1;padding:12px 16px;border-radius:8px;">Confirm new email</a>
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
                        If you did not request this change, you can safely ignore this email.
                    </td>
                </tr>
            </table>
        </body>
    </html>
                        `

    const text = [
        "Confirm your new email address",
        "",
        `You requested to change your Pokémoves account email to ${newEmail}. Use the link below to confirm this address.`,
        "",
        url,
        "",
        "If you did not request this change, you can safely ignore this email.",
    ].join("\n")

    return {
        subject,
        html,
        text,
    }
}
