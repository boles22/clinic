const MedicalProfile = require('../models/medicalProfile');

exports.createMedicalProfile = async (req, res, next) => {
  try {
    const { patientId, bloodType, allergies } = req.body;
    const medicalProfile = new MedicalProfile({
      patient: patientId,
      bloodType,
      allergies,
    });
    await medicalProfile.save();
    res.status(201).json({ message: 'Medical profile created successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getMedicalProfiles = async (req, res, next) => {
  try {
    const medicalProfiles = await MedicalProfile.find().populate('patient');
    res.status(200).json({ medicalProfiles });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.updateMedicalProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const updatedMedicalProfile = await MedicalProfile.findByIdAndUpdate(profileId, req.body, {
      new: true,
    }).populate('patient');
    res.status(200).json({ medicalProfile: updatedMedicalProfile });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getMedicalProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const medicalProfile = await MedicalProfile.findById(profileId).populate('patient');
    res.status(200).json({ medicalProfile: medicalProfile });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.deleteMedicalProfile = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    await MedicalProfile.findByIdAndDelete(profileId);
    res.status(200).json({ message: 'Medical profile deleted successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};
