const axios = require('axios');

/* -----------------------------
   WEBHOOK
------------------------------ */
const sendWebhook = async (payload) => {
  if (!process.env.WEBHOOK_URL) {
    console.warn('⚠️ WEBHOOK_URL not configured');
    return;
  }

  await axios.post(process.env.WEBHOOK_URL, payload);
};

/* -----------------------------
   EMAIL (placeholder for future)
------------------------------ */
const sendEmail = async (payload) => {
  // later: SendGrid / SES / Nodemailer
  console.log('📧 Email notification:', payload);
};

/* -----------------------------
   SLACK (placeholder for future)
------------------------------ */
const sendSlack = async (payload) => {
  // later: Slack Incoming Webhook
  console.log('💬 Slack notification:', payload);
};

/* -----------------------------
   GENERIC DISPATCHER ✅
------------------------------ */
exports.sendNotification = async ({ type, payload }) => {
  switch (type) {
    case 'webhook':
      return sendWebhook(payload);
    case 'email':
      return sendEmail(payload);
    case 'slack':
      return sendSlack(payload);
    default:
      throw new Error(`Unknown notification type: ${type}`);
  }
};
