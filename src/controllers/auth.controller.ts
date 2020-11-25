//const { Router } = require('express');

import {Router,Request, Response} from 'express';

import { UsuarioApp } from "../interface/Usuarios";
import {connect} from '../database';

import bcrypt from 'bcryptjs';

const router = Router();


// export async function register(req:Request, res:Response): Promise<Response>{

//     const {usuario, email, password} = req.body;

//     const datos:Usuario = req.body;
    
//     console.log( datos);

//     const conn = await connect();
    
//     var passw = datos.password;
//     const salt = await bcrypt.genSalt(10);
//     datos.password = await bcrypt.hash(datos.password.toString(),10);
    
//     const usuarios = await conn.query('INSERT INTO usuarios SET ?',[datos]);

//     return res.json();
// }



export async function profile(req:Request, res:Response): Promise<Response>{

    console.log( req.body);

    return res.json();
}



