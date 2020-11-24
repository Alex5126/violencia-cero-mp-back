import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {connect, MySqlConnPool} from '../database';
import { InsertResult } from '../interface/Querys';
import { UserRequest } from '../interface/Request';
import { Usuario } from '../interface/Usuario';
import UsuarioDBModel from '../models/UsuarioDBModel';

export async function getUser(req:Request, res:Response): Promise<Response>{

    console.log( req.body);
    
    const conn = await connect();

    const usuarios = await conn.query('SELECT * FROM usuarios');

    return res.json(usuarios[0]);

}

export async function login(req:Request, res:Response){

    const userRequest:UserRequest = req.body;

    let user:Usuario = await getElement(userRequest);

    if(user){
        let equals:boolean = bcrypt.compareSync(userRequest.password.toString(),user.password.toString());

        console.log(process.env.CADUCIDAD_TOKEN);
        console.log(process.env.SEED);
        console.log(equals);

        if(equals){

            let token = jwt.sign(
                {usuario:user.email},
                process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN}
            );

            res.json({
                status:true,
                token:token
            });
        }else{
            res.status(401).json({
                status:false,
                message:"Usuario o contraseña incorrecto"
            });
        }

    }else{
        res.status(401).json({
            status:false,
            message:"Usuario o contraseña incorrecto"
        });
    }
}


export async function getElement(userRequest:UserRequest):Promise<Usuario>{

    //const userRequest:UserRequest = req.body;

    const consultaUsuario = "SELECT * FROM usuarios d WHERE d.email = '"+userRequest.email+
            "' and d.estatus='ACTIVO' order by d.id desc";

    let usuarioDb = await MySqlConnPool.executeQuery(consultaUsuario);

    //console.log(usuarioDb);

    if(usuarioDb && usuarioDb.length>2){

        let usuarioRes:UsuarioDBModel[] = JSON.parse((usuarioDb).toString());

        let usuario:Usuario = {
            id:usuarioRes[0].id,
            estatus:usuarioRes[0].estatus,
            nombre:usuarioRes[0].nombres,
            apellidoM:usuarioRes[0].apellido_materno,
            apellidoP:usuarioRes[0].apellido_paterno,
            cp:usuarioRes[0].cp,
            email:usuarioRes[0].email,
            password:usuarioRes[0].password,
            tel:usuarioRes[0].telefono
        };
        return usuario;
    }
}

export async function addUser(req:Request, res:Response){

    let usuario:Usuario = req.body;


    //Valida si existe el usuario
    let user:Usuario = await getElement({email:usuario.email,password:""});

    if(user){
        //res.status(401);
        res.json({
            status:false,
            message:"usuario existente"
        });
    }else{

        let queryInsert = 'INSERT INTO usuarios SET ?';

        let password = await bcrypt.hash(usuario.password.toString(),10);

        let dataUsuario = {
            nombres:usuario.nombre,
            apellido_materno:usuario.apellidoM,
            apellido_paterno:usuario.apellidoP,
            cp:usuario.cp,
            email:usuario.email,
            estatus:"ACTIVO",
            password:password,
            telefono:usuario.tel
        }

        //console.log(dataProcedimiento);

        let insert:InsertResult = await MySqlConnPool.executeInsert(queryInsert, dataUsuario);
        
        if(insert.affectedRows === 1){
            res.json({
                status:true,
                id:insert.insertId
            });
        }else{
            res.json({
                status:false
            });
        }
    }
}

export async function updateElement(req:Request, res:Response){

    let usuario:Usuario = req.body;
    const id = req.params.id;

    let queryUsuario = 'UPDATE usuarios SET ? WHERE id = ?';

    let dataUsuario = {
        nombres:usuario.nombre,
        apellido_materno:usuario.apellidoM,
        apellido_paterno:usuario.apellidoP,
        cp:usuario.cp,
        email:usuario.email,
        estatus:usuario.estatus,
        password:usuario.password,
        telefono:usuario.tel
    }

    let update:InsertResult = await MySqlConnPool.executeUpdate(queryUsuario, dataUsuario,Number.parseInt(id));

    if(update.affectedRows === 1){
        res.json({
            status:true,
            id:update.insertId
        });
    }else{
        res.json({
            status:false
        });
    }
}