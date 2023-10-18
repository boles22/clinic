const express = require('express');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', isAuth.checkUser);

module.exports = router;
