const jwt = require('jsonwebtoken');

const isPatient = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied." });
  } 
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.role === 'patient') {
      req.user = decoded;
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Not a patient.' });
    }
  } catch (error) {
    return res.status(401).json({ message: "Access denied. Not a patient." });
  }
};

module.exports = isPatient;
