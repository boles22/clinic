const bcrypt = require('bcrypt');
const genAuthToken = require('../utils/genAuthToken');
const Doctor = require('../models/doctor');
const cloudinary = require('../utils/cloudinary');
const Specialization = require('../models/specialization');
const Appointment = require('../models/appointment');

exports.createDoctor = async (req, res, next) => {
  try {
    const { name, email, bio, image, password, specializationId } = req.body;

    if(image) {
        const uploadRes = await cloudinary.uploader.upload(image, {
            upload_preset: "clinic",
            folder: "clinic/doctors", // Specify the subfolder name here
        });
        if(uploadRes) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const doctor = new Doctor({
            name,
            email,
            bio,
            image: uploadRes,
            password: hashedPassword,
            specialization: specializationId,
            });
            const savedDoctor = await doctor.save();
            const specialization = await Specialization.findById(specializationId);
            specialization.doctors.push(savedDoctor);
            await specialization.save();
            res.status(201).json({ message: 'Doctor created successfully.' });
        }
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().populate('specialization');
    res.status(200).json({ doctors });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId).populate('specialization');
    res.status(200).json({ doctor });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getDoctorByToken = async (req, res, next) => {
  try {
    console.log('getDoctorByToken');
    const doctorId = req.user._id;
    const doctor = await Doctor.findById(doctorId).populate('specialization');
    res.status(200).json({ doctor });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getAppointmentsByToken = async (req, res, next) => {
  try {;
    const doctorId = req.user._id;
    const appointments = await Appointment.find({doctor: doctorId}).populate('doctor').populate('patient');
    res.status(200).json({ appointments });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.updateDoctor = async (req, res, next) => {
    try {
        // const { doctorId } = req.params;
        const doctorId = req.user._id;
        const { specializationId } = req.body;
        console.log('req.body',req.body)
        const specialization = await Specialization.findById(specializationId);
        if (!specialization) {
          return res.status(404).json({ message: 'Specialization not found.' });
        }
        const doctorToUpdate = await Doctor.findById(doctorId);
        
        // Delete the existing image from Cloudinary
        if (doctorToUpdate.image && doctorToUpdate.image.public_id) {
        await cloudinary.uploader.destroy(doctorToUpdate.image.public_id);
        }

        // Upload the new image to Cloudinary
        if (req.body.image) {
        const uploadRes = await cloudinary.uploader.upload(req.body.image, {
            upload_preset: 'clinic',
            folder: 'clinic/doctors', // Specify the subfolder name here
        });
        req.body.image = uploadRes;
        }

        // Update the doctor with the new data including the new image
        const updatedDoctor = await Doctor.findByIdAndUpdate(
          doctorId, 
          { specialization: specializationId, ...req.body },
          { new: true }
          );
        
        res.status(200).json({ doctor: updatedDoctor });
    } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        res.status(500).send(err);
        }
};

exports.deleteDoctor = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    await Doctor.findByIdAndDelete(doctorId);
    res.status(200).json({ message: 'Doctor deleted successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.loginDoctor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }
    const role = 'doctor';
    const token = genAuthToken(doctor, role);
    res.status(200).json({ token, role: 'doctor' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.updateDoctorPassword = async (req, res, next) => {
    try {
      const { doctorId } = req.params;
      const { newPassword } = req.body;
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the doctor's password
      await Doctor.findByIdAndUpdate(doctorId, { password: hashedPassword }, { new: true });
  
      res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      res.status(500).send(err);
    }
};
  
