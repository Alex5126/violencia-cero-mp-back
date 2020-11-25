import {Router,Request, Response,NextFunction} from 'express';
import jwt, { decode } from 'jsonwebtoken';
import { LoginPayload } from '../interface/Payloads';

export function validaToken(req: any, res:Response, next:NextFunction){

    let token:string = req.get('Authorization');

    if(token != null && token.startsWith("Bearer ")) {
        token = token.substring(7);
    }
    
    jwt.verify(token, process.env.SEED,(error, decoded) =>{
        if(error){
            console.log(error);
            return res.status(401).json({
                status:false,
                message:error.message
            });
        }else{
            //decodedPayload:LoginPayload=decoded;
            req.usuarioPayload = decoded;
            next();
        }
    });

    

    //console.log(token);
}