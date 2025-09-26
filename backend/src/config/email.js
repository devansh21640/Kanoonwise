const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter based on environment
let transporter;

if (process.env.USE_ETHEREAL_EMAIL === "true") {
  // Use Ethereal Email for testing (creates test accounts automatically)
  transporter = nodemailer.createTransporter({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "ethereal.user@ethereal.email",
      pass: "ethereal.pass",
    },
  });
} else {
  // Use configured SMTP
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const sendEmail = async (to, subject, text) => {
  // Check if we should send real emails (controlled by SEND_REAL_EMAILS env var)
  const shouldSendRealEmails = process.env.SEND_REAL_EMAILS === "true";

  if (!shouldSendRealEmails) {
    console.log(`[DEV MODE] Email would be sent to: ${to}`);
    console.log(`[DEV MODE] Subject: ${subject}`);
    console.log(`[DEV MODE] Content: ${text}`);
    return; // Skip actual sending when SEND_REAL_EMAILS is not true
  }

  try {
    // Verify transporter configuration before sending
    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@kanoonwise.com",
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">KanoonWise</h2>
          <p>${text}</p>
          <p style="color: #666; font-size: 12px;">
            This is an automated email from KanoonWise. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log(`✅ Email sent successfully to ${to}`);

    // If using Ethereal Email, show preview URL
    if (process.env.USE_ETHEREAL_EMAIL === "true") {
      console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error("❌ Error sending email:", error);
    console.log(`[FALLBACK] Email content for ${to}: ${text}`);

    // In production, we should throw the error, but in development we can be more lenient
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

module.exports = sendEmail;
