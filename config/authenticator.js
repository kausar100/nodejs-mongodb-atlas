require('dotenv').config();

const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;


const generateToken = (jwt_payload) => {
    return jwt.sign(jwt_payload, key, {
        expiresIn: 60 * 30 //30 MIN
    })
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Bearer token

    if (token == null) {
        return res.status(401).send('Unauthorized');
    }

    //need to validate token
    jwt.verify(token, key, (err, jwt_payload) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        //success
        req.jwt_payload = jwt_payload;
        next();

    });
};


module.exports = { generateToken, authenticateToken };