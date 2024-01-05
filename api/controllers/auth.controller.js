import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'

export const signup = async (req,res) => {    
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10)
    try {
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ "msg": "User " + username + " created successfully" })        
    } catch (error) {
        res.status(400).json(error.message)
    }
}