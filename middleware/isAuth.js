const jwt = require('jsonwebtoken');


exports.checkUser = (req, res, next) => {

    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Access denied. Token not provided." });
    }

    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!decodedToken) {
        return res.status(403).json({ message: "Access denied. Not authorized." });
      }
      console.log(decodedToken)
      res.status(200).json({ user: decodedToken });
    } catch (error) {
      return res.status(401).json({ message: "Access denied. Invalid token." });
    }
}
