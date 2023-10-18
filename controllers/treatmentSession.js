const Appointment = require('../models/appointment');
const TreatmentSession = require('../models/treatmentSession');
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

exports.createTreatmentSession = async (req, res, next) => {
  console.log(req.body)
  try {
    // let date_ob = new Date();
    const { patient, doctor, author, date, appointment, notes } = req.body;
    const treatmentSession = new TreatmentSession({
      patient: patient,
      doctor: doctor,
      author:author,
      appointment: appointment,
      // date: date_ob.getDate(),
      date: date,
      notes,
    });
    const savedTreatmentSession = await treatmentSession.save();
    const appointment1 = await Appointment.findById(appointment);
    console.log('appointment1',appointment1);
    console.log('savedTreatmentSession',savedTreatmentSession);
    appointment1.treatmentSessions.push(savedTreatmentSession);
    appointment1.status = 'active';
    await appointment1.save();


    const doctorData = await Doctor.findById(doctor);
    const patientData = await Patient.findById(patient);
    // Sending email
    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: "gmail",
        auth: {
          user: "medical.clinic.application@gmail.com", // Your Gmail email address
          //ufal okks jtah fsya
          pass: "ufalokksjtahfsya", // Your Gmail app password
        },
      })
    );

    let mailOptions;
    if (author === "doctor") {
      mailOptions = {
        from: "medical.clinic.application@gmail.com", // Sender email address
        to: patientData.email, // Patient's email address
        subject: "Treatment Session Notes",
        html: `<p>Dear Patient,</p><p>${notes}</p><p>Best regards,<br/>Your Doctor</p>`,
      };
    } else {
      mailOptions = {
        from: "boles.nabil.shoukry@gmail.com", // Sender email address
        to: doctorData.email, // Doctor's email address
        subject: "Treatment Session Notes",
        html: `<p>Dear Doctor,</p><p>${notes}</p><p>Best regards,<br/>Your Patient</p>`,
      };
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).json({ message: 'Treatment session created successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    
    console.error(err.stack);
    res.status(500).send(err);
  }
};

exports.getTreatmentSessions = async (req, res, next) => {
  try {
    const treatmentSessions = await TreatmentSession.find().populate('patient').populate('doctor');
    res.status(200).json({ treatmentSessions });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.updateTreatmentSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const updatedTreatmentSession = await TreatmentSession.findByIdAndUpdate(sessionId, req.body, {
      new: true,
    }).populate('patient').populate('doctor');
    res.status(200).json({ treatmentSession: updatedTreatmentSession });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.getTreatmentSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const treatmentSession = await TreatmentSession.findById(sessionId).populate('patient').populate('doctor');
    res.status(200).json({ treatmentSession: treatmentSession });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};

exports.deleteTreatmentSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await TreatmentSession.findByIdAndDelete(sessionId);
    res.status(200).json({ message: 'Treatment session deleted successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};
