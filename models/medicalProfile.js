const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicalProfileSchema = new Schema({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        unique: true,
        required: true
    },
    bloodType: String,
    allergies: String,
});

const MedicalProfile = mongoose.model('MedicalProfile', medicalProfileSchema);
module.exports = MedicalProfile;
