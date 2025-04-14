import nodemailer from 'nodemailer';

// SMTP transporter setup (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your email (e.g., example@gmail.com)
    pass: process.env.EMAIL_PASS,  // Your email password or App password
  },
});

// Function to send email
const sendResetPasswordEmail = async (email: string, resetLink: string, userName: string) => {
  const emailBody = `
    <div style="background-color: #1e1e2f; padding: 30px; border-radius: 10px; color: #ffffff; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #00bcd4; text-align: center;">🔐 Password Reset Request</h2>
      <p style="font-size: 16px;">
        Hi ${userName || "there"},
      </p>
      <p style="font-size: 16px;">
        We received a request to reset your password. Click the button below to proceed. This link is valid for 1 hour.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" target="_blank"
           style="background-color: #00bcd4; color: #1e1e2f; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">
           Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #aaa;">
        If you didn’t request this, you can safely ignore this email.
      </p>
      <hr style="border-color: #333; margin-top: 40px;" />
      <p style="font-size: 12px; color: #666; text-align: center;">
        &copy; ${new Date().getFullYear()} MyApp. All rights reserved.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender address
    to: email,                     // Receiver address
    subject: 'Password Reset Request',
    html: emailBody,               // HTML email body
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
