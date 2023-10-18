const express = require('express');
const patientController = require('../controllers/patient');
const isPatient = require('../middleware/isPatient');

const router = express.Router();

router.post('/', patientController.createPatient);
router.post('/login', patientController.loginPatient);
router.get('/', isPatient, patientController.getPatients);
// router.get('/:patientId', isPatient, patientController.getPatient);
// router.put('/:patientId', isPatient, patientController.updatePatient);
router.get('/get-patient-by-id/:patientId', patientController.getPatient);
router.get('/getpatient', isPatient, patientController.getPatientByToken);
router.get('/get-appointments', isPatient, patientController.getAppointmentsByToken);
router.put('/update-patient', isPatient, patientController.updatePatient);
router.put('/:patientId/password', isPatient, patientController.updatePatientPassword);
router.delete('/:patientId', isPatient, patientController.deletePatient);

module.exports = router;
