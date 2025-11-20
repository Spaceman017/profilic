import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(toEmail, token) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Verify your ProFilic account",
    html: `<p>Welcome to ProFilic — click to verify: <a href="${url}">${url}</a></p>`,
  });
}

export async function sendResetEmail(toEmail, token) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "ProFilic password reset",
    html: `<p>Reset your password: <a href="${url}">${url}</a></p>`,
  });
}
