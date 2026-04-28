const express = require("express");
const cors = require("cors");
const errorHandler = require("./utilities/errorhandler");
const router = require("./Customers/customer.route");
const getCorsOptions = require("./utilities/corsHelper");
const connectDB = require("./db");
const dotenv = require("dotenv");
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors(getCorsOptions()));

//Routes
app.use("/api/v1", router);

app.use(errorHandler);

// Start scheduled jobs (cron)
require("./cronSchedule");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
