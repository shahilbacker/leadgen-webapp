import nodemailer from 'nodemailer';
import { LeadRecord } from '../config/db';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || '"Devorae Leads" <notifications@devorae.com>';
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@example.com';

let transporter: nodemailer.Transporter | null = null;

const initializeTransporter = async (): Promise<nodemailer.Transporter> => {
  if (transporter) return transporter;

  if (SMTP_USER && SMTP_PASS) {
    // Production / Configured SMTP (Gmail App Password, Resend, Sendgrid, etc.)
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    console.log(`[Email Service] Configured live SMTP transport (${SMTP_HOST}:${SMTP_PORT}).`);
  } else {
    // Development fallback: Use Nodemailer test account (Ethereal) or fallback stream
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[Email Service] Live SMTP credentials not set. Initialized Ethereal test mailbox (${testAccount.user}).`);
    } catch {
      // Stream transport fallback if network offline
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
      console.log('[Email Service] Offline JSON transporter initialized.');
    }
  }

  return transporter;
};

export const sendNewLeadNotification = async (lead: LeadRecord): Promise<void> => {
  try {
    const mailer = await initializeTransporter();

    const formattedDate = new Date(lead.created_at).toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: #ffffff; padding: 24px; text-align: center; }
            .content { padding: 32px 24px; }
            .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 9999px; font-weight: 600; font-size: 12px; margin-bottom: 16px; }
            .field-row { margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
            .label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
            .value { font-size: 16px; color: #1e293b; font-weight: 500; }
            .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-top: 16px; font-style: italic; color: #334155; }
            .footer { padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; background: #fafafa; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; font-size: 22px;">⚡ New Lead Generated!</h2>
              <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">High-priority inquiry from landing page</p>
            </div>
            <div class="content">
              <div class="badge">Source: ${lead.source || 'Direct Web'}</div>
              <div class="field-row">
                <div class="label">Full Name</div>
                <div class="value">${lead.name}</div>
              </div>
              <div class="field-row">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none;">${lead.email}</a></div>
              </div>
              <div class="field-row">
                <div class="label">Phone Number</div>
                <div class="value">${lead.phone || 'Not provided'}</div>
              </div>
              <div class="field-row">
                <div class="label">Timestamp</div>
                <div class="value">${formattedDate}</div>
              </div>
              <div class="field-row" style="border-bottom: none;">
                <div class="label">Message / Inquiry</div>
                <div class="message-box">${lead.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              Automated alert from Devorae Lead Engine • Admin Dashboard at http://localhost:3000/admin
            </div>
          </div>
        </body>
      </html>
    `;

    const info = await mailer.sendMail({
      from: EMAIL_FROM,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `[New Lead Alert] ${lead.name} submitted an inquiry`,
      text: `New Lead: ${lead.name} (${lead.email}, ${lead.phone})\nMessage: ${lead.message}\nSource: ${lead.source}`,
      html: htmlContent,
    });

    console.log(`[Email Service] Notification sent successfully. Message ID: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Email Service] Ethereal preview link: ${previewUrl}`);
    }
  } catch (error: any) {
    console.error(`[Email Service] Failed to send email alert: ${error.message}`);
    // Do not throw: lead creation in DB should succeed even if mail delivery encounters network issues
  }
};
