const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    treatmentSessions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'TreatmentSession'
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        default: 'pending'
    },
    // status: {
    //     type: String,
    //     enum: ['scheduled', 'completed', 'canceled'],
    //     default: 'scheduled'
    // },
    // other fields as needed
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
