const Specialization = require('../models/specialization');

exports.getSpecializations = async (req, res, next) => {
  try {
    const specializations = await Specialization.find()
    .populate('doctors');
    res.status(200).json(specializations);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    res.status(500).send(err);
  }
};
