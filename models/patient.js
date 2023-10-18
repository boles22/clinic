const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    image: {
      type: Object,
      required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    contactNumber: String,
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
