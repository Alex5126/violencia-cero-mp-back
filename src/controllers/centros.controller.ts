import {Request, Response} from 'express';
import { ProcedimientoInfo } from "../interface/Listas";
import { Procedimiento,Parrafo } from "../interface/Procedimiento";

import { MySqlConn } from '../database2';
import ProcedimientoDBModel from '../models/ProcedimientoDBModel';
import { InsertResult } from '../interface/Querys';
import CentroDBModel from '../models/CentroDBModel';
import { Centro } from '../interface/Centro';
import { EmailSender } from '../utils/mailsender';
import { MySqlConnPool } from '../database';

export async function getList(req:Request, res:Response){

    const consulta = "SELECT * FROM centrosatencion d "+
                " WHERE d.estatus IN ('ACTIVO')";

    MySqlConn.executeQuery(consulta, (err:any, centrosAtencion:CentroDBModel[])=>{
        console.log(err);
        if(err){
            res.status(400).json({
                status:false,
                message:err.sqlMessage
            })
        }else{
            let denArray:Centro[] = new Array;
            for(let i= 0;i<centrosAtencion.length;i++){
                //console.log(procedimientos[i]);
                denArray.push({
                    id:centrosAtencion[i].id,
                    descripcion:centrosAtencion[i].descripcion,
                    direccion:centrosAtencion[i].direccion,
                    nombre:centrosAtencion[i].nombre,
                    lat:centrosAtencion[i].latitud,
                    long:centrosAtencion[i].longitud
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

    const consultaCentros = "SELECT * FROM centrosatencion d "+
                "WHERE d.id = "+id;

    MySqlConn.executeQuery(consultaCentros, (err:any, centrosAtencion:CentroDBModel[])=>{
        console.log(err);
        if(err){
            res.status(400).json({
                status:false,
                message:err.sqlMessage
            })
        }else{

            let centro:Centro = {
                id:centrosAtencion[0].id,
                descripcion:centrosAtencion[0].descripcion,
                direccion:centrosAtencion[0].direccion,
                nombre:centrosAtencion[0].nombre,
                lat:centrosAtencion[0].latitud,
                long:centrosAtencion[0].longitud
            };
    
            res.json(
                centro
            );
        }
    }
    );

    // let centrosDb = MySqlConnPool.executeQuery(consultaCentros);

    // let centroRes:CentroDBModel[] = JSON.parse((await centrosDb).toString());

    // if(centrosDb !== null){
    //     console.log(centroRes[0]);
    //     let procedimiento:Centro = {
    //         id:centroRes[0].id,
    //         descripcion:centroRes[0].descripcion,
    //         direccion:centroRes[0].direccion,
    //         nombre:centroRes[0].nombre,
    //         lat:centroRes[0].latitud,
    //         long:centroRes[0].longitud
    //     };

    //     res.json(
    //         procedimiento
    //     );
    // }
}

export async function addElement(req:Request, res:Response){

    let centro:Centro = req.body;

    let queryInsert = 'INSERT INTO centrosatencion SET ?';

    let dataCentro = {
        nombre:centro.nombre,
        estatus:'ACTIVO',
        descripcion:centro.descripcion,
        direccion:centro.direccion,
        latitud:centro.lat,
        longitud:centro.long
    }

    console.log(dataCentro);

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

    let centro:Centro = req.body;
    const id = req.params.id;

    let queryDenuncia = 'UPDATE centrosatencion SET ? WHERE id = ?';

    let dataCentro = {
        nombre:centro.nombre,
        descripcion:centro.descripcion,
        direccion:centro.direccion,
        latitud:centro.lat,
        longitud:centro.long
    }

    let update:InsertResult = await MySqlConnPool.executeUpdate(queryDenuncia, dataCentro,Number.parseInt(id));

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

    let queryDenuncia = 'DELETE FROM centrosatencion WHERE id = '+id;

    let update = await MySqlConnPool.executeQuery(queryDenuncia);

    let result:InsertResult = JSON.parse((update).toString());

    if(result.affectedRows === 1){
        res.json({
            status:true
        });
    }else{
        res.json({
            status:false
        });
    }
}