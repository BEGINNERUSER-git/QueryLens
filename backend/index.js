import express from 'express';
import {databaseM} from './config/mongo.js';
import dotenv from 'dotenv';
import auth from './controller/auth.js'
import query from './controller/query.js'
import cors from 'cors';
dotenv.config();

const app=express();

databaseM();

app.use(cors({
    origin: 'http://localhost:3000',
  credentials: true  
}))
app.use(express.json());

app.use("/auth",auth);
app.use("/query",query);
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})