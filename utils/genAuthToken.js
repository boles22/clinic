const jwt = require("jsonwebtoken");

const genAuthToken = (user, role) => {
    const secretKey = process.env.JWT_SECRET_KEY

    const token = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: role
        },
        secretKey
    );

    return token;
}

module.exports = genAuthToken;