const nodeSchedule = require("node-schedule");
const customerModel = require("./Customers/customer.model");
const { sendEmail, generateBirthdayHtml } = require("./utilities/mailer");

async function runBirthdayJob() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // 1-12
    const day = today.getDate();

    // Match month and day regardless of year
    const customers = await customerModel.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$dayOfBirth" }, day] },
          { $eq: [{ $month: "$dayOfBirth" }, month] },
        ],
      },
    });

    if (customers.length > 0) {
      console.log(`Found ${customers.length} birthday(s) today.`);
      for (const customer of customers) {
        try {
          const html = generateBirthdayHtml(
            customer.name,
            process.env.OFFER_URL || "#",
          );
          const subject = `Happy Birthday, ${customer.name}! 🎉`;
          await sendEmail(customer.email, subject, html);
          console.log(`Sent birthday email to ${customer.email}`);
          // small pause to be polite to SMTP server
          await new Promise((r) => setTimeout(r, 200));
        } catch (sendErr) {
          console.error(
            `Failed to send to ${customer.email}:`,
            sendErr && sendErr.message ? sendErr.message : sendErr,
          );
        }
      }
    } else {
      console.log("No birthdays today.");
    }
  } catch (error) {
    console.error("Error occurred while fetching customer birthdays:", error);
  }
}

// Scheduled job to run every day at 7:00 AM
nodeSchedule.scheduleJob("0 7 * * *", runBirthdayJob);

module.exports = { runBirthdayJob };
