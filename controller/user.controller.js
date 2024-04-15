const User = require('../models/user');
const {errorFunction} = require('../utils/errorFunction');
const securePassword = require('../utils/securePassword');

const addUser = async (req, res, next) => {
    try {

        const { name, email,password } = req.body;

        const existingUser = await User.findOne({email:email}).lean(true);

        if (existingUser) {
            res.status(403);
            return res.json(errorFunction(true, "User Already Exists"));
        } else {
            const {hashedPassword,salt} = await securePassword(password);

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                salt
            })
            if (newUser) {
				res.status(201);
				return res.json(
					errorFunction(false, "User Created", newUser)
				);
			} else {
				res.status(403);
				return res.json(errorFunction(true, "Error Creating User"));
			}

        }

    } catch (error) {
        res.status(400);
		console.log(error);
		return res.json(errorFunction(true, "Error Adding user"));
    }
}

const getUser = async(req,res) =>{
    console.log(req);
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email:email}).lean(true);
        if(!user){
            return res.json(errorFunction(true, "User Not Found, please register yourself"));
        }

        const token =  await User.matchPasswordAndGenerateToken(email,password);
        // add cookie time limit 
        res.cookie('user',token);  
        res.send(token);


    } catch (error) {
        return res.json(errorFunction(true, `Error ${error}`));
    }
}  



module.exports = {
    addUser,
    getUser
};