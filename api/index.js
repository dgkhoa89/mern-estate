import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'

dotenv.config();

const app = express();
app.use(express.json())

mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connected database'))
    .catch((error) => console.log(error))

app.listen(3000,()=>{console.log('App started in port 3000!!');})

app.use('/api/user',userRouter)
app.use('/api/user',authRouter)

//error handling
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const msg = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message: msg
    });
})