import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10)
    try {
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ "msg": "User " + username + " created successfully" })
    } catch (error) {
        next(errorHandler(400, 'Error when signup. ' + error.message))
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email: email });
        if (!validUser) {
            return next(errorHandler(401, 'User is not found: ' + email));
        }

        const isValidPassword = bcryptjs.compareSync(password, validUser.password);
        if (!isValidPassword) {
            return next(errorHandler(401, 'Invalid password'));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.SECRETE_KEY);
        const { password: pass, ...rest } = validUser._doc
        res
            .cookie('accessToken', token)
            .status(200)
            .json(rest)
    } catch (error) {
        return next(error)
    }
}

export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.SECRETE_KEY);
            const { password: pass, ...rest } = user._doc;
            res.cookie('accessToken', token, { httpOnly: true })
                .status(200)
                .json(rest)
        } else {
            //generate password to save to db
            //36 is 0-9 and a-z, -8 is 8 char on the right
            const generatedPassword = Math.random.toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random.toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.SECRETE_KEY);
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('accessToken', token, { httpOnly: true })
                .status(200)
                .json(rest)
        }
    } catch (error) {
        next(error)
    }
}