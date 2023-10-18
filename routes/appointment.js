const express = require('express');
const appointmentController = require('../controllers/appointment');
const isDoctor = require('../middleware/isDoctor');
const isPatient = require('../middleware/isPatient');

const router = express.Router();

router.post('/create', isPatient, appointmentController.createAppointment);
router.get('/get-appointment/:appointmentId', appointmentController.getAppointment);
router.get('/', appointmentController.getAppointments);
// router.get('/:appointmentId', isDoctor, appointmentController.getAppointment);
// router.put('/:appointmentId', isDoctor, appointmentController.updateAppointment);
// router.delete('/:appointmentId', isDoctor, appointmentController.deleteAppointment);

module.exports = router;
