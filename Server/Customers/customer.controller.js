const customerModel = require("./customer.model");

// Add a customer birthday
const addCustomerBirthday = async (req, res) => {
  try {
    const { name, email, dayOfBirth } = req.body;
    const customer = new customerModel({ name, email, dayOfBirth });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all customers Birthdays (supports filtering, sorting, pagination)
const getAllCustomerBirthdays = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort,
      name,
      email,
      dayOfBirth,
      q,
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const filter = {};
    if (name) filter.name = new RegExp(name, "i");
    if (email) filter.email = new RegExp(email, "i");
    if (dayOfBirth) filter.dayOfBirth = dayOfBirth;
    if (q)
      filter.$or = [
        { name: new RegExp(q, "i") },
        { email: new RegExp(q, "i") },
      ];

    let sortObj = { name: 1 };
    if (sort) {
      sortObj = {};
      sort.split(",").forEach((s) => {
        const field = s.trim();
        if (!field) return;
        if (field.startsWith("-")) sortObj[field.slice(1)] = -1;
        else sortObj[field] = 1;
      });
    }

    const total = await customerModel.countDocuments(filter);
    const customers = await customerModel
      .find(filter)
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    res.status(200).json({
      data: customers,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a customer birthday by ID
const getCustomerBirthdayById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerModel.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a customer birthday
const updateCustomerBirthday = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, dayOfBirth } = req.body;
    const customer = await customerModel.findByIdAndUpdate(
      id,
      { name, email, dayOfBirth },
      { new: true },
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a customer birthday
const deleteCustomerBirthday = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerModel.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addCustomerBirthday,
  getAllCustomerBirthdays,
  getCustomerBirthdayById,
  updateCustomerBirthday,
  deleteCustomerBirthday,
};
