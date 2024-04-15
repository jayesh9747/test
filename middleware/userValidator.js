const joi = require("joi");
const {errorFunction} = require('../utils/errorFunction');
const validation = require("./validation");



const Schema = joi.object({
    name: joi.string().alphanum().min(3).max(25).trim(true).required(),
    email: joi.string().email().trim(true).required(),
    password: joi.string().min(8).trim(true).required(),
})



const userValidation = (req, res, next) => {

    const payload = {
        name: req.body.name, 
        email :req.body.email,
        password: req.body.password,
     }

const { error } = Schema.validate(payload);

console.log(error);

if (error) {
    res.status(406);
    return res.json(
        errorFunction(true, `Error in User Data : ${error.details[0].message}`)
    );
} else {
    next();
}

}

module.exports = userValidation;