// emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send an email notification when a new stop work order is found
 * @param {Object} entry - The stop order entry
 * @param {string} entry.title - Title of the stop work order
 * @param {string} entry.date - Date of the order
 * @param {string} entry.address - Address listed in the order
 * @param {string} entry.detailLink - Link to the full details
 */
async function sendNotification(entry) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Stop Work Order: ${entry.title}`,
    text: `
New stop work order detected:

Title: ${entry.title}
Date: ${entry.date}
Address: ${entry.address}
Link: https://www.nsw.gov.au${entry.detailLink}

- Automated Monitor System
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent for: ${entry.title}`);
  } catch (error) {
    console.error(`❌ Failed to send email for: ${entry.title}`, error);
  }
}

module.exports = { sendNotification };
