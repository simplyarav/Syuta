import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verificationLink = `${appUrl}/verify?token=${token}`;

  const mailOptions = {
    from: `"SYUTA." <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your SYUTA. Account',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 4px solid #000; background-color: #fce762;">
        <h1 style="text-transform: uppercase; border-bottom: 4px solid #000; padding-bottom: 10px;">Welcome to SYUTA.</h1>
        <p style="font-weight: bold; font-size: 16px;">We just need to verify your email address to activate your account.</p>
        <div style="margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 16px; border: 2px solid #000; display: inline-block;">Verify Email</a>
        </div>
        <p style="font-size: 12px; font-weight: bold;">If you didn't create an account, you can safely ignore this email.</p>
        <p style="font-size: 10px;">Or copy this link: ${verificationLink}</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
