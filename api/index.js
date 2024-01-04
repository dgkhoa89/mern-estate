import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const app = express();
mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connected database'))
    .catch((error) => console.log(error))

app.listen(3000,()=>{console.log('App started in port 3000!!');})