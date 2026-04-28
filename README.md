# Birthday Reminder App (CelebrationHub)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Table of Contents

- About
- Features
- Tech Stack
- Architecture
- Project Structure
- Getting Started
- Configuration
- Security
- How to Contribute?
- What's Next?
- License
- Acknowledgements
- Author

---

## About

CelebrationHub (Birthday Reminder App) is a simple automation system that collects customer birthday details and automatically sends personalized birthday emails. The system includes a small frontend form for data collection and a Node.js backend that runs a daily scheduled job to send celebratory emails.

This project is intended as an MVP to replace manual spreadsheet workflows and ensure timely, personalized customer outreach on birthdays.

See: [URL](https://birthday-reminder-app-ashen.vercel.app)

---

## Features

- Single-page form for customers to submit `name`, `email`, and `date of birth`.
- Backend CRUD API for customer records.
- Filtering, sorting and pagination on the customer list endpoint.
- Daily cron job (7:00 AM) that finds today's birthdays and sends personalized HTML emails.
- Nodemailer + Gmail integration (configurable) and a responsive email template.
- Manual job runner for testing (`npm run send-birthdays`).

---

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js, Express
- Scheduler: node-schedule
- Database: MongoDB (Mongoose)
- Email: Nodemailer (Gmail)
- Environment: dotenv

---

## Architecture

1. Client: a lightweight React app with a single customer form that POSTs to the backend API.
2. Server API: Express routes under `/api/v1` handle customer CRUD. The `customer.controller.js` implements filtering, sorting and pagination for listing customers.
3. Scheduler: `cronSchedule.js` runs daily at 07:00 and queries MongoDB for customers whose month/day of birth matches today; it uses a mailer utility to send emails.
4. Mailer: `utilities/mailer.js` encapsulates Nodemailer configuration and an HTML template loader (`templates/birthday.html`).

---

## Project Structure

- Client/
  - src/components/CustomerForm.jsx — front-end form
  - package.json — client scripts
- Server/
  - index.js — server entry
  - db.js — MongoDB connection helper
  - cronSchedule.js — daily job and `runBirthdayJob()` exported for manual runs
  - sendBirthdaysNow.js — script to run the job on-demand
  - Customers/
    - customer.model.js — Mongoose schema
    - customer.controller.js — controller (CRUD + list filters)
    - customer.route.js — router mounted at `/api/v1`
  - utilities/
    - mailer.js — nodemailer helpers
    - errorhandler.js — express error middleware
  - templates/
    - birthday.html — HTML email template
- README.md — this file

---

## Getting Started

Prerequisites:

- Node.js (16+ recommended)
- npm or yarn
- MongoDB (local or hosted)

Local setup:

1. Server

```bash
cd Server
npm install
# create a .env file (see Configuration section)
npm run dev    # or `npm start` for production
```

2. Client

```bash
cd Client
npm install
npm run dev
```

Open the client URL shown by Vite  and submit the customer form.

To test the scheduled job immediately (manual run):

```bash
cd Server
npm run send-birthdays
```

---

## Production Build & Deployment (quick guide)

1. Configure production client API URL

- Copy `Client/.env.production.example` to `Client/.env.production` and set `VITE_API_URL` to your production API base (e.g. `https://api.yourdomain.com/api/v1`).

2. Build the client

```bash
cd Client
npm install
npm run build
```

3. Deploy the built client

- Upload the `dist/` folder contents to your static host (S3, Netlify, Vercel) or to your web server (e.g., `/var/www/celebrationhub`).
- If using the Nginx reverse proxy example in `DEPLOYMENT.md`, you can serve the `dist` folder from the web root and proxy `/api` to the backend (no CORS needed).

4. Server configuration

- Ensure the backend `Server/.env` has `CLIENT_ORIGIN` set to your production client origin, or deploy the client and API under the same origin and use the Nginx proxy.
- Restart your backend so env vars take effect.

5. Verify

- Open your production URL and submit the form. Use DevTools Network tab to confirm the POST goes to the correct `VITE_API_URL` or to `/api/v1/customers` if proxied.


## Configuration

Create a `.env` file in the `Server/` folder with the following variables (do not commit secrets):

```
MONGODB_URI=your_mongodb_connection_string
PORT=4000
GMAIL_USER=your.email@gmail.com
GMAIL_PASS=your_gmail_app_password
CLIENT_ORIGIN=http://localhost:5173
OFFER_URL=https://example.com/offer
FROM_NAME=CelebrationHub
FROM_EMAIL=your.from@example.com
```

Notes:

- For Gmail, using an App Password or OAuth2 is recommended. App Passwords require enabling 2FA on the Google account.
- If `MONGODB_URI` is not provided, the server will attempt to connect to `mongodb://127.0.0.1:27017/birthday-reminder-app`.

---

## Security

- Never commit `.env` or secrets to source control. Use environment-specific secret management for production.
- For production email delivery, prefer OAuth2 authentication or a transactional email provider (SendGrid, Mailgun, Postmark) over basic auth.
- Implement rate limiting and batching if sending to large recipient lists to avoid provider throttling.
- Validate and sanitize input on the server. The controller already attempts basic validation through Mongoose schema rules.

---

## How to Contribute?

- Fork the repo and open a pull request with clear motivation and tests/verification steps.
- Suggested workflow:
  1. Create a feature branch.
  2. Implement and test locally.
  3. Submit a PR with a description of changes.
- Please include updates to the email template or add unit tests where appropriate.

---

## What's Next?

- Move email transport to OAuth2 or a transactional email service for improved deliverability.
- Add queuing and background workers (Bull/Redis) for large mailing lists.
- Add an admin UI to preview, schedule, and resend emails.
- Add automated tests and CI pipelines.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for full terms.

---

## Acknowledgements

- Based on a simple automation concept to replace spreadsheet-based birthday reminders.
- Email template imagery: unsplash (used in template sample).

---

## Author

Primary maintainer: Damilola Ajele
