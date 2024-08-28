const nodemailer = require('nodemailer');
const { stringify } = require('qs');
require('dotenv').config();

const EmailTemplate = {
  ForgotPassword: 'ForgotPassword',
  VerifyEmail: 'VerifyEmail',
};

// const getTemplateTitle = {
//   [EmailTemplate.ForgotPassword]: 'Reset password',
//   [EmailTemplate.VerifyEmail]: 'Email Confirmation',
// };

// class MailerService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.MAILHOG_HOST,
//       port: process.env.MAILHOG_PORT,
//       secure:false,
//     });
//   }

//   async send(recipient, templateId, params) {
//     const mailOptions = {
//       from: process.env.MAILER_EMAIL_FROM,
//       to: Array.isArray(recipient) ? recipient.join(', ') : recipient,
//       subject: getTemplateTitle[templateId],
//       text: this.generateEmailContent(templateId, params),
//     };

//     await this.transporter.sendMail(mailOptions);
//   }

//   generateEmailContent(templateId, params) {
//     switch (templateId) {
//       case EmailTemplate.ForgotPassword:
//         return `Hello ${params.name},\n\nPlease reset your password using the following link: ${params.resetLink}`;
//       case EmailTemplate.VerifyEmail:
//         return `Hello ${params.name},\n\nPlease verify your email using the following code: ${params.code}`;
//       default:
//         return '';
//     }
//   }

//   async sendForgotPasswordEmail(recipient, token, name) {
//     const resetLink = `${process.env.FRONTEND_HOST_URL}/reset-password?${stringify({ token })}`;
//     await this.send(recipient, EmailTemplate.ForgotPassword, { name, resetLink });
//   }

//   async verifyMail(recipient, code, name) {
//     await this.send(recipient, EmailTemplate.VerifyEmail, { name, code });
//   }
// }

// module.exports = { MailerService, EmailTemplate };
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