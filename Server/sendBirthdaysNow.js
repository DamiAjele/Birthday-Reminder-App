const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./db');
connectDB();

const { runBirthdayJob } = require('./cronSchedule');

(async () => {
    try {
        await runBirthdayJob();
        console.log('Done running birthday job.');
        process.exit(0);
    } catch (err) {
        console.error('Error running birthday job:', err);
        process.exit(1);
    }
})();
