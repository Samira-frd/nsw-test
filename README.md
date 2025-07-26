# 🏗️ NSW Stop Work Orders Monitor

This project monitors the **NSW Register of Building Work Orders** webpage and automatically:

- Scrapes new stop work orders (using `puppeteer-core`)
- Saves them to a local `SQLite` database
- Sends an email notification (via `nodemailer`) when new entries are detected

---

## 📦 Tech Stack

- **Node.js**
- **puppeteer-core** (headless scraping)
- **sqlite3** (lightweight local DB)
- **nodemailer** (email notifications)
- **dotenv** (environment config)

---

## 📁 Project Structure

```
stop-work-orders-monitor/
├── scraper.js            # Main entry point
├── db.js                 # SQLite setup and DB connection
├── emailService.js       # Email sending logic
├── .env                  # Environment variables
├── stop_orders.db        # SQLite database (auto-created)
├── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the project

```bash
git clone https://github.com/Samira-frd/nsw-test.git
cd stop-work-orders-monitor
```

### 2. Install dependencies

```bash
npm install
```

> ✅ If you're using `puppeteer-core`, make sure **Google Chrome is installed** on your machine.

### 3. Create `.env` file

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NOTIFY_EMAIL=recipient@example.com
```

### 4. Run the scraper

```bash
npm start
```

### ✅ Method A: Use Gmail App Password (Recommended)
1. Enable **2-Step Verification** in your Google account.
2. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate a password for **"Mail" > "Windows Computer"**
4. Use that password in your `.env` file

### 🔁 Method B: Use Outlook (Simpler Alternative)

```env
EMAIL_USER= email@outlook.com
EMAIL_PASS= email_password
```

Then change `emailService.js` to:

```js
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

---

## 🧪 Test Email Locally

You can test email separately by calling:

```js
const { sendNotification } = require('./emailService');

sendNotification({
  title: 'Test Order',
  date: 'Today',
  address: '123 Test St',
  detailLink: '/test-order'
});
```

---

## 🛠️ Troubleshooting

| Error | Fix |
|-------|-----|
| `EAUTH 535-5.7.8` | Use **Gmail App Password** or switch to **Outlook** |
| `ETIMEDOUT` | Whitelist port 587 or use PowerShell:<br>`New-NetFirewallRule -DisplayName "Allow Gmail SMTP" -Direction Outbound -Protocol TCP -LocalPort 587 -Action Allow` |
| `Cannot launch Chrome` | Install Chrome and point `executablePath` to its path |
| `Database not saving` | Make sure `stop_orders.db` is not open in another app |

---

## 📬 Output Example (Email Body)

```
New stop work order detected:

Title: Rectification Order for ABC Pty Ltd
Date: 25 July 2025
Address: 123 Main St, Sydney
Link: https://www.nsw.gov.au/departments-and-agencies/building-commission/register-of-building-work-orders/order-abc

- Automated Monitor System
```

---

## 🧹 Future Improvements

- Web UI to view stored records
- Cron job scheduling (hourly scraping)
- Deploy to cloud with SQLite or switch to PostgreSQL

---

## 👤 Author

Samira Frd  

---