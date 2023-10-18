const express = require('express');
const doctorController = require('../controllers/doctor');
const isDoctor = require('../middleware/isDoctor');

const router = express.Router();

router.post('/', doctorController.createDoctor);
router.post('/login', doctorController.loginDoctor);
router.get('/', doctorController.getDoctors);
router.get('/get-doctor-by-id/:doctorId', doctorController.getDoctor);
router.get('/getdoctor', isDoctor, doctorController.getDoctorByToken);
router.get('/get-appointments', isDoctor, doctorController.getAppointmentsByToken);
router.put('/update-doctor', isDoctor, doctorController.updateDoctor);
router.put('/:doctorId/password', isDoctor, doctorController.updateDoctorPassword);
router.delete('/:doctorId', isDoctor, doctorController.deleteDoctor);

module.exports = router;
