const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const { errorFunction } = require('../utils/errorFunction');
const { createTokenForUser } = require('../services/userAuthentication');
const { required } = require('joi');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    profilePictureUrl: {
        type: String,
    },
    salt: {
        type: String
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER',
        required: true
    }

}, { timestamps: true })




UserSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        res.status(401)
        return res.json(
            errorFunction(true, `User Not Found`)
        )
    }

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = await bcrypt.hash(password, salt);

    if (hashedPassword !== userProvidedHash) {
        throw new Error('Email or password are wrong!');
    }
    const token = createTokenForUser(user);

    return token;
})

const User = mongoose.model('user', UserSchema);
module.exports = User;