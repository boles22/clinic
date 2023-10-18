const bcrypt = require('bcrypt');
const genAuthToken = require('../utils/genAuthToken');
const Patient = require('../models/patient');
const cloudinary = require('../utils/cloudinary');
const Appointment = require('../models/appointment');

exports.createPatient = async (req, res, next) => {
  try {
    const { name, email, image, password, contactNumber } = req.body;

    if(image) {
        const uploadRes = await cloudinary.uploader.upload(image, {
            upload_preset: "clinic",
            folder: "clinic/patients", // Specify the subfolder name here
        });
        if(uploadRes) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const patient = new Patient({
            name,
            email,
            image: uploadRes,
            password: hashedPassword,
            contactNumber,
            });
            await patient.save();
            res.status(201).json({ message: 'Patient created successfully.' });
        }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.status(200).json({ patients });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    res.status(200).json({ patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getPatientByToken = async (req, res, next) => {
  try {
    console.log('getPatientByToken');
    const patientId = req.user._id;
    const patient = await Patient.findById(patientId);
    res.status(200).json({ patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getAppointmentsByToken = async (req, res, next) => {
  try {;
    const patientId = req.user._id;
    const appointments = await Appointment.find({patient: patientId}).populate('doctor').populate('patient');
    res.status(200).json({ appointments });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
      // const { patientId } = req.params;
      const patientId = req.user._id;
      const patientToUpdate = await Patient.findById(patientId);
      
      // Delete the existing image from Cloudinary
      if (patientToUpdate.image && patientToUpdate.image.public_id) {
      await cloudinary.uploader.destroy(patientToUpdate.image.public_id);
      }

      // Upload the new image to Cloudinary
      if (req.body.image) {
      const uploadRes = await cloudinary.uploader.upload(req.body.image, {
          upload_preset: 'clinic',
          folder: 'clinic/patients', // Specify the subfolder name here
      });
      req.body.image = uploadRes;
      }

      // Update the patient with the new data including the new image
      const updatedPatient = await Patient.findByIdAndUpdate(
        patientId, 
        { ...req.body },
        { new: true }
        );
      
      res.status(200).json({ patient: updatedPatient });
  } catch (err) {
      if (!err.statusCode) {
    err.statusCode = 500;
  }
  res.status(500).send(err);
  }
};

exports.getPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);
    res.status(200).json({ patient: patient });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.deletePatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    await Patient.findByIdAndDelete(patientId);
    res.status(200).json({ message: 'Patient deleted successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.loginPatient = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }
    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }
    const role = 'patient';
    const token = genAuthToken(patient, role);
    res.status(200).json({ token, role: 'patient' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};


exports.updatePatientPassword = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { newPassword } = req.body;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the Patient's password
    await Patient.findByIdAndUpdate(patientId, { password: hashedPassword }, { new: true });

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};