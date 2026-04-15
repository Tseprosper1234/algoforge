/*// services/emailService.js - NODEMAILER ONLY (No Resend)
const nodemailer = require('nodemailer');

// Check if SMTP is configured
const isSMTPConfigured = () => {
  return process.env.SMTP_HOST && 
         process.env.SMTP_USER && 
         process.env.SMTP_PASS &&
         process.env.SMTP_USER !== 'your_email@gmail.com' &&
         process.env.SMTP_PASS !== 'your_app_password';
};

// Create transporter only if configured
let transporter = null;

if (isSMTPConfigured()) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Connection Error:', error.message);
    } else {
      console.log('✅ SMTP Server is ready to send emails');
    }
  });
} else {
  console.warn('⚠️ SMTP not configured. Email features will be disabled.');
}

async function sendEmail(to, subject, html) {
  if (!transporter) {
    console.error('Email not sent: SMTP not configured');
    return { error: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"AlgoForge" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}, messageId: ${info.messageId}`);
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
        .code { font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: #f0f0f0; border-radius: 10px; margin: 20px 0; letter-spacing: 5px; }
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
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 AlgoForge. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  return await sendEmail(to, 'Reset Your Password - AlgoForge', html);
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


// services/emailService.js - Using Brevo (Sendinblue) with correct syntax
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Initialize Brevo API client
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Helper function to send emails
async function sendEmail(to, subject, htmlContent) {
    if (!process.env.BREVO_API_KEY) {
        console.error('BREVO_API_KEY not configured. Email not sent.');
        return { error: 'Email service not configured' };
    }

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { 
        name: "AlgoForge", 
        email: "tseprosper02@gmail.com"
    };
    sendSmtpEmail.to = [{ email: to }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Email sent to ${to} with message ID: ${data.messageId}`);
        return { success: true, messageId: data.messageId };
    } catch (error) {
        console.error('❌ Error sending email via Brevo:', error.response?.body || error.message);
        return { error: error.message };
    }
}

// Send verification code
async function sendVerificationEmail(to, code) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Verify Your Email</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                .code { font-size: 32px; font-weight: bold; background: #f0f0f0; display: inline-block; padding: 10px 20px; border-radius: 8px; letter-spacing: 4px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <h2 style="color: #3b82f6;">AlgoForge</h2>
            <p>Your verification code is:</p>
            <div class="code">${code}</div>
            <p>This code expires in 15 minutes.</p>
            <p>If you didn't create an account, please ignore this email.</p>
        </body>
        </html>
    `;
    return await sendEmail(to, 'Verify Your Email - AlgoForge', html);
}

// Send password reset link
async function sendPasswordResetEmail(to, resetLink) {
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reset Your Password</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                .button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <h2 style="color: #3b82f6;">AlgoForge</h2>
            <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
        </body>
        </html>
    `;
    return await sendEmail(to, 'Reset Your Password - AlgoForge', html);
}

// Notify about new content
async function notifyNewContent(to, fileName, fileId) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>New Content Available</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; }
                .button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <h2 style="color: #3b82f6;">AlgoForge</h2>
            <p>New learning topic added:</p>
            <h3>${fileName}</h3>
            <a href="${frontendUrl}/files/${fileId}" class="button">View Now</a>
        </body>
        </html>
    `;
    return await sendEmail(to, 'New Content Available - AlgoForge', html);
}

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    notifyNewContent,
    sendEmail
};
