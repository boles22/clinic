const express = require('express');
const treatmentSessionController = require('../controllers/treatmentSession');
const isDoctor = require('../middleware/isDoctor');
const isPatient = require('../middleware/isPatient');

const router = express.Router();

router.post('/', treatmentSessionController.createTreatmentSession);
// router.get('/', isPatient, treatmentSessionController.getTreatmentSessions);
// router.get('/:sessionId', isPatient, treatmentSessionController.getTreatmentSession);
// router.put('/:sessionId', isDoctor, treatmentSessionController.updateTreatmentSession);
// router.delete('/:sessionId', isDoctor, treatmentSessionController.deleteTreatmentSession);

module.exports = router;

