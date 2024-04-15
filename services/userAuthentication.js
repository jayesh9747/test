// JWT have three parts header, payload and secret


const JWT = require('jsonwebtoken');

const secret = process.env.JWT_PRIVATE_KEY;

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
    };
    const token = JWT.sign(payload, secret);
    return token;
}

function checkUserToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    checkUserToken,
    createTokenForUser
}