const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const appSecret = "secretforsimpletaskmanager";

class Helper {
    hashPassword(value) {
        return bcrypt.hashSync(value, saltRounds);
    }

    comparePasswords(password, encyrptedPassword) {
        return bcrypt.compareSync(password, encyrptedPassword);
    }

    generateToken(payload) {
        return jwt.sign(payload, appSecret, {
            expiresIn: "24h" // expires in 24 hours
        });
    }

    // Create middleware for protecting routes
    checkToken (req, res, next) {
        console.log('validate route');
        // check header or url parameters or post parameters for token
        let token = req.body.token || req.query.token || req.headers["x-access-token"];

        // decode token
        if (token) {
            // verifies secret and checks exp
            jwt.verify(token, appSecret, function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        message: "Failed to authenticate token."
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            // if there is no token return an error
            return res.status(403).send({
                success: false,
                message: "No token provided."
            });
        }
    }
}
module.exports = Helper;