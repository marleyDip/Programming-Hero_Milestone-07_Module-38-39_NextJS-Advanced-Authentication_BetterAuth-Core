import { siteConfig } from "@/lib/site";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use a verified domain in production, e.g. "NextAuth Pro <no-reply@yourdomain.com>"
const FROM =
  process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;

// User-controlled text (like names) must be escaped before going into HTML
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function template({ preview, title, greeting, body, buttonLabel, url, note }) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#05060a;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</span>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05060a;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#0a0b12;border:1px solid #23253a;border-radius:24px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="height:4px;background:linear-gradient(90deg,#8b5cf6,#22d3ee,#bef264);font-size:0;line-height:0;">&nbsp;</td>
            </tr>
    
            <tr>
              <td style="padding:36px 36px 8px;">
                <p style="margin:0 0 24px;font-size:15px;font-weight:700;color:#ffffff;letter-spacing:-0.2px;">
                  ${escapeHtml(siteConfig.name)}
                </p>

                <h1 style="margin:0 0 12px;font-size:26px;line-height:1.25;color:#ffffff;letter-spacing:-0.4px;">
                  ${title}
                </h1>
                
                <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#cbd5e1;">
                  ${greeting}
                </p>
                
                <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#94a3b8;">
                  ${body}
                </p>
                
                <a href="${url}" style="display:inline-block;padding:14px 28px;background:#bef264;color:#0b0c0e;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;">
                  ${buttonLabel}
                </a>
              </td>
            </tr>
            <tr>

              <td style="padding:28px 36px 8px;">
                <p style="margin:0 0 6px;font-size:12px;color:#64748b;">
                  Button not working? Copy and paste this link into your browser:
                </p>
                
                <p style="margin:0;font-size:12px;line-height:1.6;word-break:break-all;">
                  <a href="${url}" style="color:#a78bfa;text-decoration:none;">
                    ${url}
                  </a>
                </p>
              </td>
            </tr>
            
            <tr>
              <td style="padding:24px 36px 36px;">
                <div style="border-top:1px solid #23253a;padding-top:20px;">
                  <p style="margin:0;font-size:12px;line-height:1.7;color:#64748b;">
                    ${note}
                  </p>
                  
                  <p style="margin:12px 0 0;font-size:12px;color:#475569;">
                    © ${new Date().getFullYear()} ${escapeHtml(siteConfig.name)}
                  </p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function send({ to, subject, html }) {
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      throw new Error("Failed to send email");
    }
  } catch (err) {
    console.error("[email] Failed to send:", err);
  }
}

/* ---------- Public senders ---------- */
export const sendVerificationEmail = ({ user, url }) =>
  send({
    to: user.email,
    subject: `Verify your email for ${siteConfig.name}`,

    html: template({
      preview: "Confirm your email address to finish setting up your account.",
      title: "Verify your email",
      greeting: `Hi ${escapeHtml(user.name || "there")},`,
      body: `Welcome to ${escapeHtml(siteConfig.name)}! Please confirm your email address to activate your account and sign in.`,
      buttonLabel: "Verify email address",
      url,
      note: "This link expires in 7 days. If you didn't create an account, you can safely ignore this email.",
    }),
  });

export const sendResetPasswordEmail = ({ user, url }) =>
  send({
    to: user.email,
    subject: `Reset your ${siteConfig.name} password`,
    html: template({
      preview: "Use this link to choose a new password.",
      title: "Reset your password",
      greeting: `Hi ${escapeHtml(user.name || "there")},`,
      body: "We received a request to reset your password. Click the button below to choose a new one.",
      buttonLabel: "Reset password",
      url,
      note: "This link expires in 1 hour. If you didn't request a reset, ignore this email. Your password won't change.",
    }),
  });

export const sendChangeEmailConfirmation = ({ user, newEmail, url }) =>
  send({
    to: user.email,
    subject: "Confirm your new email address",

    html: template({
      preview: "Approve the change to your account email.",
      title: "Confirm your new email",
      greeting: `Hi ${escapeHtml(user.name || "there")},`,
      body: `You asked to change your account email to <strong style="color:#e2e8f0;">${escapeHtml(newEmail)}</strong>. Approve the change with the button below.`,
      buttonLabel: "Approve change",
      url,

      note: "If you didn't request this, ignore this email and consider changing your password. Your email stays the same until you approve.",
    }),
  });
