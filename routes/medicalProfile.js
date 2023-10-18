const express = require('express');
const medicalProfileController = require('../controllers/medicalProfile');
const isPatient = require('../middleware/isPatient');

const router = express.Router();

router.post('/', isPatient, medicalProfileController.createMedicalProfile);
router.get('/', isPatient, medicalProfileController.getMedicalProfiles);
router.get('/:profileId', isPatient, medicalProfileController.getMedicalProfile);
router.put('/:profileId', isPatient, medicalProfileController.updateMedicalProfile);
router.delete('/:profileId', isPatient, medicalProfileController.deleteMedicalProfile);

module.exports = router;
