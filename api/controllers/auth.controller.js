import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';

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