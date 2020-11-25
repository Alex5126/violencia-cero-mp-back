import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {connect, MySqlConnPool} from '../database';
import { InsertResult } from '../interface/Querys';
import { UserRecovery, UserRequest } from '../interface/Request';
import { UsuarioApp } from '../interface/Usuarios';
import UsuarioDBModel from '../models/UsuarioDBModel';
import { EmailSender } from '../utils/mailsender';
import RecoveryCodes from '../utils/RecoveryCodes';

export async function login(req:Request, res:Response){

    const userRequest:UserRequest = req.body;

    let user:UsuarioApp = await getElement(userRequest);

    if(user){
        let equals:boolean = bcrypt.compareSync(userRequest.password.toString(),user.password.toString());

        console.log("Login:"+userRequest.email+" "+equals);

        if(equals){
            let token = jwt.sign(
                {usuario:user.email,id:user.id},
                process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN_APP}
            );

            res.json({
                status:true,
                id:user.id,
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

export async function perfil(req:Request, res:Response){

    const id = req.params.id;

    const consultaUsuario = `SELECT * FROM usuariosapp d WHERE d.id = ${id}
            order by d.id desc`;

    let usuarioDb = await MySqlConnPool.executeQuery(consultaUsuario);

    //console.log(usuarioDb);

    if(usuarioDb && usuarioDb.length>2){

        let usuarioRes:UsuarioDBModel[] = JSON.parse((usuarioDb).toString());

        let usuario:UsuarioApp = {
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
        delete usuario.password;
        res.json(
            usuario
        );
    }else{
        res.status(401).json({
            status:false,
            message:"Id incorrecto"
        });
    }
}

export async function getElement(userRequest:UserRequest):Promise<UsuarioApp>{

    //const userRequest:UserRequest = req.body;

    const consultaUsuario = "SELECT * FROM usuariosapp d WHERE d.email = '"+userRequest.email+
            "' and d.estatus='ACTIVO' order by d.id desc";

    let usuarioDb = await MySqlConnPool.executeQuery(consultaUsuario);

    //console.log(usuarioDb);

    if(usuarioDb && usuarioDb.length>2){

        let usuarioRes:UsuarioDBModel[] = JSON.parse((usuarioDb).toString());

        let usuario:UsuarioApp = {
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

    let usuario:UsuarioApp = req.body;


    //Valida si existe el usuario
    let user:UsuarioApp = await getElement({email:usuario.email,password:""});

    if(user){
        //res.status(401);
        res.json({
            status:false,
            message:"usuario existente"
        });
    }else{

        let queryInsert = 'INSERT INTO usuariosapp SET ?';

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

    let usuario:UsuarioApp = req.body;
    const id = req.params.id;

    let queryUsuario = 'UPDATE usuariosapp SET ? WHERE id = ?';

    let password = undefined;

    if(usuario.password !== undefined){
        password = await bcrypt.hash(usuario.password.toString(),10);
    }

    let dataUsuario = {
        nombres:usuario.nombre,
        apellido_materno:usuario.apellidoM,
        apellido_paterno:usuario.apellidoP,
        cp:usuario.cp,
        email:usuario.email,
        estatus:usuario.estatus,
        password:password,
        telefono:usuario.tel
    }

    if(dataUsuario.nombres === undefined) delete dataUsuario.nombres;
    if(dataUsuario.apellido_materno === undefined) delete dataUsuario.apellido_materno;
    if(dataUsuario.apellido_paterno === undefined) delete dataUsuario.apellido_paterno;
    if(dataUsuario.cp === undefined) delete dataUsuario.cp;
    if(dataUsuario.email === undefined) delete dataUsuario.email;
    if(dataUsuario.estatus === undefined) delete dataUsuario.estatus;
    if(dataUsuario.password === undefined) delete dataUsuario.password;
    if(dataUsuario.telefono === undefined) delete dataUsuario.telefono;

    let update:InsertResult = await MySqlConnPool.executeUpdate(queryUsuario, dataUsuario,Number.parseInt(id));

    if(update.affectedRows === 1){
        res.json({
            status:true,
            id:id
        });
    }else{
        res.json({
            status:false
        });
    }
}

export async function sendRecoveryCode(req:Request, res:Response){

    let usuario:UserRequest = req.body;
    
    let user:UsuarioApp = await getElement({email:usuario.email,password:""});

    if(user){
        let code = RecoveryCodes.createCode(usuario.email);
        let html = RecoveryCodes.htmlCode(code);
        
        var mailOptions = {
            from: 'hoteles@contravel.com.mx',
            to: usuario.email,
            subject: `Código de recuperación`,
            //text: html,
            html:html
          };
    
        EmailSender.sendMail(mailOptions);

        res.json({
            status:true,
            message:"Email enviado "+usuario.email
        });

    }else{
        res.json({
            status:false,
            message:"No existe email"
        });
    }
}


export async function validCode(req:Request, res:Response){

    let usuario:UserRecovery = req.body;
    
    let user:UsuarioApp = await getElement({email:usuario.email,password:""});

    let code:String = RecoveryCodes.validCode(usuario.email);

    if(code){
        if(code === usuario.code){
            res.json({
                status:true,
                message:"codigo correcto",
                id:user.id
            });
        }else{
            res.json({
                status:false,
                message:"codigo incorrecto"
            });
        }
    }else{
        res.json({
            status:false,
            message:"No se pudo validar, enviar nuevamente"
        });
    }

}

export async function updatePasswordRecovery(req:Request, res:Response){

    let usuario:UserRecovery = req.body;
    const id = req.params.id;

    let queryUsuario = 'UPDATE usuariosapp SET ? WHERE id = ?';

    let code:String = RecoveryCodes.validCode(usuario.email);

    if(code && code === usuario.code){

        let password = undefined;

        if(usuario.password !== undefined){
            password = await bcrypt.hash(usuario.password.toString(),10);
        }

        let dataUsuario = {
            password:password
        }

        let update:InsertResult = await MySqlConnPool.executeUpdate(queryUsuario, dataUsuario,Number.parseInt(id));

        if(update.affectedRows === 1){
            res.json({
                status:true
            });
        }else{
            res.json({
                status:false
            });
        }

        RecoveryCodes.removeCode(usuario.email);
    }else{
        res.json({
            status:false,
            message:"codigo invalido"
        });
    }
}