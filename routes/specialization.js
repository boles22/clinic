const express = require('express');
const specializationController = require('../controllers/specialization');

const router = express.Router();

router.get('/', specializationController.getSpecializations);

module.exports = router;
