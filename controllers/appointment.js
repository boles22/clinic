const Appointment = require('../models/appointment');

exports.createAppointment = async (req, res, next) => {
  try {
    const patientId = req.user._id;
    const { doctorId, description, date } = req.body;
    console.log(req.body);
    const appointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      // patient: req.user._id,
      description,
      date,
    });
    await appointment.save();
    res.status(201).json({ message: 'Appointment created successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().populate('doctor').populate('patient');
    res.status(200).json({ appointments });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, req.body, {
      new: true,
    }).populate('doctor').populate('patient');
    res.status(200).json({ appointment: updatedAppointment });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    console.log('appointmentId',appointmentId);
    const appointment = await Appointment.findById(appointmentId).populate('doctor').populate('patient').populate('treatmentSessions');
    res.status(200).json({ appointment: appointment });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({ message: 'Appointment deleted successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};
