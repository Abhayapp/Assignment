import jwt from "jsonwebtoken";
import express,{NextFunction, Request,Response} from "express";

const jwtSecretKey= String(process.env.JWTSECRETKEY);
const verifyjwtToken =async(req:Request,res:Response,next:NextFunction)=>{
    const token=req.headers["authorization"];
    if(token){
        jwt.verify(token,jwtSecretKey,(err,decodedToken)=>{
            if(err){
                res.json({Error:"please login again"})        
            }
            else{
                req.body.decodedToken = decodedToken;
                next()
            }
        })
    }
    else{
        res.json({Error:"Please Login Again"}) 
     }
}

export default verifyjwtToken;