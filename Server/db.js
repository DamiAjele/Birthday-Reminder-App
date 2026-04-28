const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/birthday-reminder-app';
    try {
        await mongoose.connect(uri, { connectTimeoutMS: 10000 });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message || error);
        console.warn('Continuing without DB connection. API requests requiring DB will fail until a valid MONGODB_URI is provided.');
    }
};

module.exports = connectDB;