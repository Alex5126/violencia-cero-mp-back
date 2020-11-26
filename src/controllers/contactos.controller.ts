import {Request, Response} from 'express';

import { MySqlConnPool} from '../database';
import { MySqlConn } from '../database2';
import { Contacto } from '../interface/Contacto';
import { InsertResult } from '../interface/Querys';
import ContactoDBModel from '../models/ContactoDBModel';

export async function getList(req:Request, res:Response){

    const consulta = "SELECT * FROM contactos d "+
                " WHERE d.estatus IN ('ACTIVO')";

    MySqlConn.executeQuery(consulta, (err:any, contactos:ContactoDBModel[])=>{
        if(err){
            res.status(400).json({
                status:false,
                message:err.sqlMessage
            })
        }else{
            let denArray:Contacto[] = new Array;
            for(let i= 0;i<contactos.length;i++){
                //console.log(procedimientos[i]);
                denArray.push({
                    id:contactos[i].id,
                    name:contactos[i].nombre,
                    description:contactos[i].descripcion,
                    number:contactos[i].numero
                });
            }
            res.json({
                status:true,
                data:denArray
            })
        }
    }
    );
}

export async function getElement(req:Request, res:Response){

    const id = req.params.id;

    const consultaContactos = "SELECT * FROM contactos d "+
                "WHERE d.id = "+id;

    let contactoDb = MySqlConnPool.executeQuery(consultaContactos);

    let contactos:ContactoDBModel[] = JSON.parse((await contactoDb).toString());

    if(contactoDb !== null){

        let contacto:Contacto = {
            id:contactos[0].id,
            name:contactos[0].nombre,
            description:contactos[0].descripcion,
            number:contactos[0].numero
        };

        res.json(
            contacto
        );
    }
}

export async function addElement(req:Request, res:Response){

    let contacto:Contacto = req.body;

    let queryInsert = 'INSERT INTO contactos SET ?';

    let dataCentro = {
        nombre:contacto.name,
        descripcion:contacto.description,
        estatus:"ACTIVO",
        numero:contacto.number
    }

    //console.log(dataCentro);

    let insert:InsertResult = await MySqlConnPool.executeInsert(queryInsert, dataCentro);
    
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

export async function updateElement(req:Request, res:Response){

    let contacto:Contacto = req.body;
    const id = req.params.id;

    let queryDenuncia = 'UPDATE contactos SET ? WHERE id = ?';

    let dataContacto = {
        nombre:contacto.name,
        descripcion:contacto.description,
        numero:contacto.number
    }

    let update:InsertResult = await MySqlConnPool.executeUpdate(queryDenuncia, dataContacto,Number.parseInt(id));

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


export async function deleteElement(req:Request, res:Response){

    const id = req.params.id;

    let queryDenuncia = 'UPDATE contactos SET ? WHERE id = ?';

    let dataContacto = {
        estatus:"BAJA"
    }

    let update:InsertResult = await MySqlConnPool.executeUpdate(queryDenuncia, dataContacto,Number.parseInt(id));

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