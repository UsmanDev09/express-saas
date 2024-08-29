const nodemailer = require('nodemailer');
const { stringify } = require('qs');

const EmailTemplate = {
  ForgotPassword: 'ForgotPassword',
  VerifyEmail: 'VerifyEmail',
};
const config = {
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  frontendHostUrl: process.env.FRONTEND_HOST_URL,
};

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAILHOG_HOST,
  port: process.env.MAILHOG_PORT,
  secure: false,
});

// Send email function
const sendEmail = async (recipient, subject, htmlContent) => {
  const mailOptions = {
    from: `"Shaper" <${process.env.MAILER_EMAIL_FROM}>`,
    to: recipient,
    subject: subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

// Get template title
const getTemplateTitle = (templateId) => {
  const titles = {
    [EmailTemplate.ForgotPassword]: 'Reset password',
    [EmailTemplate.VerifyEmail]: 'Email Confirmation',
  };
  return titles[templateId];
};

// Send Forgot Password Email
const sendForgotPasswordEmail = async (recipient, token, name) => {
  const subject = getTemplateTitle(EmailTemplate.ForgotPassword);
  const resetLink = `${process.env.FRONTEND_HOST_URL}/reset-password?${stringify({ token })}`;
  const htmlContent = `<p>Hi ${name},</p><p>Please click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`;

  return sendEmail(recipient, subject, htmlContent);
};

// Send Verification Email
const sendVerificationEmail = async (recipient, code, name) => {
  const subject = getTemplateTitle(EmailTemplate.VerifyEmail);
  const htmlContent = `<p>Hi ${name},</p><p>Your verification code is: ${code}</p>`;

  return sendEmail(recipient, subject, htmlContent);
};

module.exports = {
  sendForgotPasswordEmail,
  sendVerificationEmail,
};