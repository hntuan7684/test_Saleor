const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
require("dotenv").config();

const jsonReportPath = "error-report.json";
const htmlReportPath = "error-report.html";
const pdfReportPath = "error-report.pdf";

// 1. Run Playwright test and export to JSON
exec(
  `npx playwright test tests/register.spec.js --reporter=json > ${jsonReportPath}`,
  async (err) => {
    if (err) {
      console.error("❌ Test failed to execute:", err);
      return;
    }

    console.log("✅ Test finished. Generating error report...");

    // 2. Read JSON result and extract only failed tests
    const raw = fs.readFileSync(jsonReportPath, "utf-8");
    const data = JSON.parse(raw);

    let html = `<h1 style="color:red;">Playwright Error Report</h1>`;

    function extractErrors(obj) {
      let html = "";
      if (obj?.suites) {
        for (const suite of obj.suites) {
          html += extractErrors(suite); // đệ quy cho nested suites
        }
      }

      if (obj?.specs) {
        for (const spec of obj.specs) {
          for (const test of spec.tests) {
            for (const result of test.results) {
              if (result.status === "failed") {
                html += `<h2>${spec.title}</h2>`;
                html += `<p><b>Status:</b> ${result.status}</p>`;
                if (result.error) {
                  html += `<pre><b>Message:</b>\n${result.error.message}</pre>`;
                  html += `<pre><b>Stack:</b>\n${result.error.stack}</pre>`;
                }
              }
            }
          }
        }
      }
      return html;
    }

    // Gọi hàm
    const errorHtml = extractErrors(data);
    if (errorHtml.trim() === "") {
      html += "<p>No failed tests found.</p>";
    } else {
      html += errorHtml;
    }
      

    // 3. Save error HTML
    fs.writeFileSync(htmlReportPath, html, "utf-8");
    console.log("✅ HTML error report generated.");

    // 4. Convert HTML to PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const htmlFileUrl = `file://${path.resolve(__dirname, htmlReportPath)}`;

    await page.goto(htmlFileUrl, { waitUntil: "networkidle0" });
    await page.pdf({
      path: pdfReportPath,
      format: "A4",
      printBackground: true,
    });
    await browser.close();
    console.log("✅ PDF error report created.");

    // 5. Send Email with PDF
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Playwright Auto Report" <${process.env.MAIL_USER}>`,
      to: "locb2111935@student.ctu.edu.vn", // Thay địa chỉ người nhận tại đây
      subject: "🧪 Playwright Test Error Report",
      text: "Please find attached the error report from the test.",
      html: "<h2>🛑 Lỗi trong quá trình test</h2><p>Xem chi tiết trong file đính kèm.</p>",
      attachments: [
        {
          filename: "error-report.pdf",
          path: pdfReportPath,
          contentType: "application/pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("❌ Failed to send email:", error);
      }
      console.log("✅ Email sent successfully:", info.response);
    });
  }
);
