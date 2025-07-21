import express from 'express';
import mysql from 'mysql2/promise';
import {setDBconfig,getDBconfig} from '../session/sessionStore.js'
import fetch_user from "../middleware/fetch_user.js";
import {explainParser} from '../utils/explainParser.js'
import { queryHistory } from '../model/query.js';

const router=express.Router();

//ROUTE 1:TO CONNECT  TO USER DATABASE
router.post('/connect',fetch_user,async (req,res)=>{
    const {host,user,password,database,port}=req.body;
    const userId=req.user.id;

    try {
        const conn=await mysql.createConnection({
            host,user,password,database,port
        });
        setDBconfig(userId,{host,user,password,database,port});
        return res.status(200).json({success:true,message:"MySQL connected successfully"});

    } catch (error) {
        return res.status(500).json({success:false,error:error.message});
        
    }

})

//ROUTE 2: EXPLAIN 
router.post("/explain",fetch_user,async (req,res)=>{
    const {queryAnalyse}=req.body;
    const userId=req.user.id;
    
    const DBconfig=getDBconfig(userId);
   
    if(!DBconfig) return res.status(400).json({success:false,message:"MySQL not connected"});
    try {
        const conn=await mysql.createConnection(DBconfig);
        const [rows]=await conn.query(`EXPLAIN FORMAT=JSON ${queryAnalyse}`);
        // const [rows]=await conn.query(`${queryAnalyse}`);
        const tree=explainParser(rows);

        await queryHistory.create({
            user:userId,
            queryText:queryAnalyse,
            result:tree,
            rawResult:rows
        })

        return res.status(200).json({success:true,message:"Explanation successful",result:tree,raw:rows});
    } catch (error) {
        return res.status(500).json({success:false,error:error.message});

    }


});


//ROUTE :3 user history
router.get('/history',fetch_user,async (req,res)=>{
try {
    const result=await queryHistory.find({user:req.user.id});
    res.json({result});
} catch (error) {
       return res.status(500).json({success:false,error:error.message});
    
}
})

export default router;