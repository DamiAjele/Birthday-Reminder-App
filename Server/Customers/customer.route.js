const express = require("express");
const {
  addCustomerBirthday,
  getAllCustomerBirthdays,
  getCustomerBirthdayById,
  updateCustomerBirthday,
  deleteCustomerBirthday,
} = require("./customer.controller");

const router = express.Router();

router.post("/customers", addCustomerBirthday);
router.get("/customers", getAllCustomerBirthdays);
router.get("/customers/:id", getCustomerBirthdayById);
router.put("/customers/:id", updateCustomerBirthday);
router.delete("/customers/:id", deleteCustomerBirthday);

module.exports = router;
