/*// services/emailService.js
const nodemailer = require('nodemailer');

// SMTP Configuration
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};

console.log('SMTP Config:', {
  host: smtpConfig.host,
  port: smtpConfig.port,
  user: smtpConfig.auth.user,
  hasPass: !!smtpConfig.auth.pass
});

const transporter = nodemailer.createTransport(smtpConfig);

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error.message);
    console.error('Please check your internet connection and SMTP settings');
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

async function sendEmail(to, subject, html) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP credentials not configured. Email not sent.');
    return { error: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"AlgoForge" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}, messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { error: error.message };
  }
}

async function sendVerificationEmail(to, code) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        .code { font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: white; border-radius: 10px; margin: 20px 0; letter-spacing: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧠 AlgoForge</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Thank you for registering with AlgoForge!</p>
          <p>Your verification code is:</p>
          <div class="code">${code}</div>
          <p>This code will expire in <strong>15 minutes</strong>.</p>
          <p>Enter this code on the verification page to activate your account.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 AlgoForge. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(to, 'Verify Your Email - AlgoForge', html);
}

async function sendPasswordResetEmail(to, resetLink) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧠 AlgoForge</h1>
        </div>
        <div class="content">
          <h2>Reset Your Password</h2>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${resetLink}</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 AlgoForge. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(to, 'Password Reset Request - AlgoForge', html);
}

async function notifyNewContent(to, fileName, fileId) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Content Available</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 10px 10px 0 0; }
        .content { padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧠 AlgoForge</h1>
        </div>
        <div class="content">
          <h2>New Content Added!</h2>
          <p>A new learning topic has been added to AlgoForge.</p>
          <p><strong>${fileName}</strong></p>
          <div style="text-align: center;">
            <a href="${frontendUrl}/files/${fileId}" class="button">View Now</a>
          </div>
          <p>Keep learning and growing your skills!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 AlgoForge. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(to, 'New Content Available - AlgoForge', html);
}

module.exports = { 
  sendPasswordResetEmail, 
  notifyNewContent, 
  sendVerificationEmail,
  sendEmail 
};
*/




// services/emailService.js
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

async function sendVerificationEmail(to, code) {
  try {
    const { data, error } = await resend.emails.send({
      from: `AlgoForge <${FROM_EMAIL}>`,
      to: [to],
      subject: 'Verify Your Email - AlgoForge',
      html: `
        <!DOCTYPE html>
        <html>
        <head><style>.code{font-size:32px;font-weight:bold;color:#3b82f6;letter-spacing:5px;margin:20px 0;}</style></head>
        <body>
          <h2>Welcome to AlgoForge! 🧠</h2>
          <p>Your verification code is:</p>
          <div class="code">${code}</div>
          <p>This code expires in 15 minutes.</p>
        </body>
        </html>
      `,
    });
    
    console.log(`✅ Email sent to ${to}, id: ${data.id}`);
    return { success: true };
  } catch (error) {
    console.error('Resend error:', error);
    return { error: error.message };
  }
}

module.exports = { sendVerificationEmail };
