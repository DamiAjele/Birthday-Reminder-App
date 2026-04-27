const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const FROM_NAME = process.env.FROM_NAME || "CelebrationHub";
const FROM_EMAIL = process.env.FROM_EMAIL || GMAIL_USER;

if (!GMAIL_USER || !GMAIL_PASS) {
  console.warn(
    "GMAIL_USER or GMAIL_PASS not set. Mailer will fail until credentials provided.",
  );
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

async function sendEmail(to, subject, html) {
  const info = await transporter.sendMail({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
  return info;
}

function generateBirthdayHtml(name, offerLink = "#") {
  const tplPath = path.join(__dirname, "..", "templates", "birthday.html");
  let tpl = "";
  try {
    tpl = fs.readFileSync(tplPath, "utf8");
  } catch (err) {
    tpl = `<p>Happy Birthday, {{name}}!</p><p>Visit <a href="{{offer_link}}">our offer</a></p>`;
  }
  return tpl.replace(/{{name}}/g, name).replace(/{{offer_link}}/g, offerLink);
}

module.exports = { sendEmail, generateBirthdayHtml };
