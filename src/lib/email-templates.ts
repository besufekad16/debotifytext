export function getWelcomeEmailHtml(name: string) {
  const firstName = name.split(" ")[0] || "there";
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to DebotifyText</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
          }
          .header {
            background-color: #15803d; /* Forest Green */
            padding: 32px 40px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .content {
            padding: 40px;
            line-height: 1.6;
          }
          h2 {
            margin-top: 0;
            font-size: 20px;
            color: #0f172a;
          }
          p {
            margin: 16px 0;
            color: #334155;
            font-size: 16px;
          }
          .btn {
            display: inline-block;
            background-color: #15803d;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 10px;
            margin-bottom: 10px;
          }
          .footer {
            background-color: #f1f5f9;
            padding: 24px 40px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DebotifyText</h1>
          </div>
          <div class="content">
            <h2>Welcome aboard, ${firstName}! 👋</h2>
            <p>We're thrilled to have you join DebotifyText.</p>
            <p>Our goal is to help you easily humanize your AI-generated text, making it undetectable and completely natural for any use case.</p>
            <p>You can get started right away by visiting your dashboard:</p>
            <div style="text-align: center;">
              <a href="https://www.debotifytext.com/" class="btn">Go to Dashboard</a>
            </div>
            <p>If you have any questions or need help, just hit reply to this email. We're always here for you!</p>
            <p>Best regards,<br>The DebotifyText Team</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} DebotifyText. All rights reserved.<br>
            <a href="https://www.debotifytext.com" style="color: #15803d; text-decoration: none;">debotifytext.com</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getContactConfirmationHtml(name: string) {
  const firstName = name.split(" ")[0] || "there";
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>We received your message - DebotifyText</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
          }
          .header {
            background-color: #15803d; /* Forest Green */
            padding: 32px 40px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .content {
            padding: 40px;
            line-height: 1.6;
          }
          p {
            margin: 16px 0;
            color: #334155;
            font-size: 16px;
          }
          .footer {
            background-color: #f1f5f9;
            padding: 24px 40px;
            text-align: center;
            font-size: 14px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Message Received</h1>
          </div>
          <div class="content">
            <p>Hi ${firstName},</p>
            <p>Thanks for reaching out! We've received your message and our team will get back to you as soon as possible (usually within 24 hours).</p>
            <p>If you need to add anything else, you can just reply directly to this email.</p>
            <p>Best regards,<br>The DebotifyText Support Team</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} DebotifyText.<br>
            <a href="https://www.debotifytext.com" style="color: #15803d; text-decoration: none;">debotifytext.com</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getAdminContactNotificationHtml(name: string, email: string, message: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .panel { background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #eee; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h2>New Contact Request</h2>
        <p>You've received a new message from the contact form.</p>
        <div class="panel">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      </body>
    </html>
  `;
}
