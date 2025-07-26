const puppeteer = require("puppeteer-core");
const db = require('./services/db');
const { sendNotification } = require('./services/emailService');

async function scrapeStopWorkOrders() {
  
  
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  })

  const page = await browser.newPage();

  await page.goto(
    "https://www.nsw.gov.au/departments-and-agencies/building-commission/register-of-building-work-orders",
    {
      waitUntil: "networkidle2", // wait for all network requests to finish
    }
  );

  // Wait for the data table or container to appear (adjust selector!)
  await page.waitForSelector(".nsw-search-results"); // or another valid selector

  // Extract the table data
  const data = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll(".nsw-list-item"));
    return items.map((item) => {
      const titleEl = item.querySelector(".nsw-list-item__title a");
      return {
        date: item.querySelector(".nsw-list-item__info")?.innerText.trim(),
        title: titleEl?.innerText.trim(),
        detailLink: titleEl?.href,
        address: item.querySelector(".nsw-list-item__copy p")?.innerText.trim(),
      };
    });
  });

  await browser.close();
  // console.log(data);
  data.forEach(entry => {
    db.get(`SELECT * FROM stop_orders WHERE detailLink = ?`, [entry.detailLink], (err, row) => {
      if (err) return console.error(err);
      if (!row) {
        db.run(
          `INSERT INTO stop_orders (title, date, address, detailLink) VALUES (?, ?, ?, ?)`,
          [entry.title, entry.date, entry.address, entry.detailLink],
          (err) => {
            if (err) return console.error(err);
            sendNotification(entry); // send notification only if new
          }
        );
      } else {
      console.log(row)
      }
    });
  });
}

scrapeStopWorkOrders();
