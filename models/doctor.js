const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    bio: {
        type: String,
        required: true
    },
    image: {
      type: Object,
      required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    specialization: {
        type: Schema.Types.ObjectId,
        ref: 'Specialization',
        required: true
    },
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
