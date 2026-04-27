const nodeSchedule = require('node-schedule');
const customerModel = require('./Customers/customer.model');

// Scheduled job to run every day at 7:00 AM
nodeSchedule.scheduleJob('0 7 * * *', async () => {
    try {
        const today = new Date();
        const month = today.getMonth() + 1; // getMonth() returns 0-11
        const day = today.getDate();
        const customers = await customerModel.find({
            dayOfBirth: {
                $gte: new Date(today.getFullYear(), month - 1, day),
                $lt: new Date(today.getFullYear(), month - 1, day + 1)
            }
        });
        if (customers.length > 0) {
            console.log('Today\'s Birthdays:');
            customers.forEach(customer => {
                console.log(`${customer.name} (${customer.email})`);
            });
        } else {
            console.log('No birthdays today.');
        }
    } catch (error) {
        console.error('Error occurred while fetching customer birthdays:', error);
    }
});