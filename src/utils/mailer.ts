import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2a2a2a;">Password Reset Request</h2>
        <p style="font-size: 16px;">We received a request to reset your password. Click the link below to reset it:</p>
        <p style="font-size: 16px; margin-top: 10px; text-align: center;">
          <a href="${resetLink}" style="background-color: #1e1e2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
        </p>
        <p style="font-size: 14px; margin-top: 20px; color: #888;">If you did not request this change, please ignore this email.</p>
        <p style="font-size: 14px; margin-top: 20px; color: #888;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email', error);
  }
};
