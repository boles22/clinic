const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specializationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    doctors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Doctor'
        }
    ],
});

const Specialization = mongoose.model('Specialization', specializationSchema);
module.exports = Specialization;
