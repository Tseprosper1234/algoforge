// services/emailService.js
const nodemailer = require('nodemailer');

// Test SMTP connection on startup
const testConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Add timeout and connection options
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
};

console.log('SMTP Config:', {
  host: testConfig.host,
  port: testConfig.port,
  user: testConfig.auth.user,
  hasPass: !!testConfig.auth.pass
});

const transporter = nodemailer.createTransport(testConfig);

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
    <h2>Verify Your Email Address</h2>
    <p>Thank you for registering with AlgoForge!</p>
    <p>Your verification code is: <strong style="font-size: 24px;">${code}</strong></p>
    <p>This code will expire in 15 minutes.</p>
    <p>Enter this code on the verification page to activate your account.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `;
  return await sendEmail(to, 'Verify Your Email - AlgoForge', html);
}

async function sendPasswordResetEmail(to, resetLink) {
  const html = `
    <h2>Reset Your Password</h2>
    <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>If you didn't request this, please ignore this email.</p>
  `;
  return await sendEmail(to, 'Password Reset Request - AlgoForge', html);
}

async function notifyNewContent(to, fileName, fileId) {
  const html = `
    <h2>New Content Added!</h2>
    <p>A new learning topic "${fileName}" has been added to AlgoForge.</p>
    <a href="${process.env.FRONTEND_URL}/files/${fileId}">View Now</a>
  `;
  return await sendEmail(to, 'New Content Available - AlgoForge', html);
}

module.exports = { 
  sendPasswordResetEmail, 
  notifyNewContent, 
  sendVerificationEmail,
  sendEmail 
};
