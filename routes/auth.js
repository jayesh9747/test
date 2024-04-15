const express = require('express');
const router = express.Router();
const Joi = require('joi');

const { getUser, addUser } = require('../controller/user.controller');

const validateWith = require('../middleware/validation')

const SignInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(5),
});

const SignUpSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(25).trim(true).required(),
    email: Joi.string().email().trim(true).required(),
    password: Joi.string().min(8).trim(true).required(),
})


router.post('/signin', validateWith(SignInSchema), getUser)
router.post('/signup', validateWith(SignUpSchema), addUser)

module.exports = router;
