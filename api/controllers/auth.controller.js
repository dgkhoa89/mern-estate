import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import {errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {    
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10)
    try {
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ "msg": "User " + username + " created successfully" })        
    } catch (error) {
        next(errorHandler(400,'Error when signup. ' + error.message))
    }
}

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email: email});
        if(!validUser) {
            return next(errorHandler(401,'User is not found: ' + email));
        }
        
        const isValidPassword = bcryptjs.compareSync(password, validUser.password);
        if(!isValidPassword){
            return next(errorHandler(401,'Invalid password'));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.SECRETE_KEY);
        const {password : pass, ...rest} = validUser._doc
        res
            .cookie('accessToken', token)
            .status(200)
            .json(rest)
    } catch (error) {
        return next(error)
    }

    
}