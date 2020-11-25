import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {connect, MySqlConnPool} from '../database';
import { InsertResult } from '../interface/Querys';
import { UserRecovery, UserRequest } from '../interface/Request';
import { UsuarioAdm, UsuarioApp } from '../interface/Usuarios';
import UsuarioAdmModel from '../models/UsuarioAdmModel';
import UsuarioDBModel from '../models/UsuarioDBModel';
import { EmailSender } from '../utils/mailsender';
import RecoveryCodes from '../utils/RecoveryCodes';
import { LoginPayload } from '../interface/Payloads';


export async function login(req:Request, res:Response){

    const userRequest:UserRequest = req.body;

    let user:UsuarioAdm = await getElement(userRequest);

    if(user){
        let equals:boolean = bcrypt.compareSync(userRequest.password.toString(),user.password.toString());

        console.log("Login:"+equals);

        if(equals){
            console.log(process.env.CADUCIDAD_TOKEN_APP);
            let token = jwt.sign(
                {usuario:user.email,id:user.id},
                process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN_ADM}
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

export async function perfil(req:any, res:Response){

    let usuario:LoginPayload = req.usuarioPayload;

    const consultaUsuario = `SELECT * FROM usuariosadm d WHERE d.id = ${usuario.id}
            order by d.id desc`;

    let usuarioDb = await MySqlConnPool.executeQuery(consultaUsuario);

    //console.log(usuarioDb);

    if(usuarioDb && usuarioDb.length>2){

        let usuarioRes:UsuarioAdmModel[] = JSON.parse((usuarioDb).toString());

        let usuario:UsuarioAdm = {
            id:usuarioRes[0].id,
            nombre:usuarioRes[0].nombre,
            apellido:usuarioRes[0].apellido,
            email:usuarioRes[0].email,
            password:usuarioRes[0].password
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

export async function getUsersApp(req:Request, res:Response){


    const consultaUsuario = "SELECT * FROM usuariosapp d WHERE "+
        " d.estatus='ACTIVO' order by d.id desc";

    let usuarioDb = await MySqlConnPool.executeQuery(consultaUsuario);

    //console.log(usuarioDb);

    if(usuarioDb && usuarioDb.length>2){

        let usuarioRes:UsuarioDBModel[] = JSON.parse((usuarioDb).toString());

        let denArray:UsuarioApp[] = new Array;
        for(let i = 0;i < usuarioRes.length;i++){
            let usuario:UsuarioApp = {
                id:usuarioRes[i].id,
                estatus:usuarioRes[i].estatus,
                nombre:usuarioRes[i].nombres,
                apellidoM:usuarioRes[i].apellido_materno,
                apellidoP:usuarioRes[i].apellido_paterno,
                cp:usuarioRes[i].cp,
                email:usuarioRes[i].email,
                password:usuarioRes[i].password,
                tel:usuarioRes[i].telefono
            };
            delete usuario.password;
            denArray.push(usuario);
        }

        res.json({
            status:true,
            data:denArray
        });

    }else{
        res.json({
            status:false,
            data:"Sin datos"
        });
    }
}


export async function getElement(userRequest:UserRequest):Promise<UsuarioAdm>{

    //const userRequest:UserRequest = req.body;

    const consultaUsuario = "SELECT * FROM usuariosadm d WHERE d.email = '"+userRequest.email+
            "' and d.estatus='ACTIVO' order by d.id desc";

    let usuarioDb = await MySqlConnPool.executeQuery(consultaUsuario);

    //console.log(usuarioDb);

    if(usuarioDb && usuarioDb.length>2){

        let usuarioRes:UsuarioAdmModel[] = JSON.parse((usuarioDb).toString());

        let usuario:UsuarioAdm = {
            id:usuarioRes[0].id,
            nombre:usuarioRes[0].nombre,
            apellido:usuarioRes[0].apellido,
            email:usuarioRes[0].email,
            password:usuarioRes[0].password
        };
        return usuario;
    }
}

export async function addUser(req:Request, res:Response){

    let usuario:UsuarioAdm = req.body;


    //Valida si existe el usuario
    let user:UsuarioAdm = await getElement({email:usuario.email,password:""});

    if(user){
        //res.status(401);
        res.json({
            status:false,
            message:"usuario existente"
        });
    }else{

        let queryInsert = 'INSERT INTO usuariosadm SET ?';

        let password = await bcrypt.hash(usuario.password.toString(),5);

        let dataUsuario = {
            nombre:usuario.nombre,
            apellido:usuario.apellido,
            email:usuario.email,
            estatus:"ACTIVO",
            password:password
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

    let usuario:UsuarioAdm = req.body;
    const id = req.params.id;

    let queryUsuario = 'UPDATE usuariosadm SET ? WHERE id = ?';

    let password = undefined;

    if(usuario.password !== undefined){
        password = await bcrypt.hash(usuario.password.toString(),5);
    }

    let dataUsuario = {
        nombre:usuario.nombre,
        apellido:usuario.apellido,
        email:usuario.email,
        password:password
    }

    if(dataUsuario.nombre === undefined) delete dataUsuario.nombre;
    if(dataUsuario.apellido === undefined) delete dataUsuario.apellido;
    if(dataUsuario.email === undefined) delete dataUsuario.email;
    //if(dataUsuario.estatus === undefined) delete dataUsuario.estatus;
    if(dataUsuario.password === undefined) delete dataUsuario.password;

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

export async function sendRecoveryCode(req:Request, res:Response){

    let usuario:UserRequest = req.body;
    
    let user:UsuarioAdm = await getElement({email:usuario.email,password:""});

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
    
    let user:UsuarioAdm = await getElement({email:usuario.email,password:""});

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

    let queryUsuario = 'UPDATE usuariosadm SET ? WHERE id = ?';

    let code:String = RecoveryCodes.validCode(usuario.email);

    if(code){

        let password = undefined;

        if(usuario.password !== undefined){
            password = await bcrypt.hash(usuario.password.toString(),5);
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
    }else{
        res.json({
            status:false,
            message:"codigo invalido"
        });
    }
}