/*// services/emailService.js
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
};*/




// services/emailService.js
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email - use your verified domain or resend.dev for testing
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
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .code { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 5px; margin: 20px 0; }
            .footer { font-size: 12px; color: #999; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Welcome to AlgoForge! 🧠</h2>
            <p>Thank you for registering. Please verify your email address using the code below:</p>
            <div class="code">${code}</div>
            <p>This code will expire in <strong>15 minutes</strong>.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <div class="footer">
              <p>AlgoForge - Learn Algorithms, Data Structures & Complexity</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    if (error) {
      console.error('Resend error:', error);
      throw error;
    }
    
    console.log(`Verification email sent to ${to}, id: ${data.id}`);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { error: error.message };
  }
}

async function sendPasswordResetEmail(to, resetLink) {
  try {
    const { data, error } = await resend.emails.send({
      from: `AlgoForge <${FROM_EMAIL}>`,
      to: [to],
      subject: 'Reset Your Password - AlgoForge',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Password Reset Request</h2>
            <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Or copy this link: ${resetLink}</p>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log(`Password reset email sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { error: error.message };
  }
}

async function notifyNewContent(to, fileName, fileId) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://algoforge.onrender.com';
    const { data, error } = await resend.emails.send({
      from: `AlgoForge <${FROM_EMAIL}>`,
      to: [to],
      subject: 'New Content Available - AlgoForge',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>📚 New Learning Content!</h2>
            <p>A new topic has been added to AlgoForge:</p>
            <h3>"${fileName}"</h3>
            <a href="${frontendUrl}/files/${fileId}" class="button">View Now</a>
            <p>Keep learning and growing your skills!</p>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log(`New content notification sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { error: error.message };
  }
}

module.exports = { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  notifyNewContent 
};
