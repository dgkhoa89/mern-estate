import jwt from 'jsonwebtoken'
import { errorHandler } from "./error.js"

export const verifyToken = (req, res, next)=>{
    // const token = req.cookies.accessToken
    // if(!token) return next(errorHandler(401,'Unauthorized'));
    // jwt.verify(token, process.env.SECRETE_KEY, (err, user)=>{
    //     if(err) return next(errorHandler(403,'Forbidden'));
    //     req.user = user;
    //     next();
    // });
    
    console.log('Temporary skip validate token');
    next();
}