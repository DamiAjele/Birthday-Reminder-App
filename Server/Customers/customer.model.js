const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dayOfBirth: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});


const customerModel = mongoose.model('Customer', customerSchema);
customerModel.createIndexes({ email: 1 , unique: true });
customerModel.createIndexes({ name: 1 });
customerModel.createIndexes({ dayOfBirth: 1 });

module.exports = customerModel;