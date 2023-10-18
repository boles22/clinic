const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const treatmentSessionSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    notes: String,
    author: {
        type: String,
        enum: ['doctor', 'patient'],
        default: 'doctor'
    },
});

const TreatmentSession = mongoose.model('TreatmentSession', treatmentSessionSchema);
module.exports = TreatmentSession;
