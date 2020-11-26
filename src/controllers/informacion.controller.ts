import {Request, Response} from 'express';
import { InformacionInfo } from "../interface/Listas";
import { Procedimiento,Parrafo } from "../interface/Procedimiento";

import { MySqlConnPool} from '../database';
import { MySqlConn } from '../database2';
import InformacionDBModel from '../models/InformacionDBModel';
import { InsertResult } from '../interface/Querys';

export async function getList(req:Request, res:Response){

    const consulta = "SELECT d.id,d.titulo,d.estatus,d.fecha"+
                " FROM informacion d "+
                " WHERE d.estatus IN ('ACTIVO')";

    MySqlConn.executeQuery(consulta, (err:any, informacion:InformacionDBModel[])=>{
        if(err){
            //console.log("Error:"+err);
            res.status(400).json({
                status:false,
                message:err
            })
        }else{
            let denArray:InformacionInfo[] = new Array;
            for(let i= 0;i<informacion.length;i++){
                //console.log(informacion[i]);
                denArray.push({
                    id:informacion[i].id,
                    nombre:informacion[i].titulo
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

    const consultaProcedimiento = "SELECT * FROM informacion d "+
                "WHERE d.id = "+id;

    let procedimientoDb = MySqlConnPool.executeQuery(consultaProcedimiento);

    let procedimientoRes:InformacionDBModel[] = JSON.parse((await procedimientoDb).toString());

    if(procedimientoDb !== null){

        let parrafosStr:string = procedimientoRes[0].parrafos.toString();

        let parrafos:Parrafo[] = JSON.parse(parrafosStr);

        let procedimiento:Procedimiento = {
            id:procedimientoRes[0].id,
            estatus:procedimientoRes[0].estatus,
            titulo:procedimientoRes[0].titulo,
            parrafos:parrafos
        };

        res.json(
            procedimiento
        );
    }
}

export async function addElement(req:Request, res:Response){

    let procedimiento:Procedimiento = req.body;

    let queryInsert = 'INSERT INTO informacion SET ?';

    let dataProcedimiento = {
        titulo:procedimiento.titulo,
        estatus:'ACTIVO',
        parrafos:JSON.stringify(procedimiento.parrafos)
    }

    console.log(dataProcedimiento);

    let insert:InsertResult = await MySqlConnPool.executeInsert(queryInsert, dataProcedimiento);
    
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

    let procedimiento:Procedimiento = req.body;
    const id = req.params.id;

    let queryDenuncia = 'UPDATE informacion SET ? WHERE id = ?';

    let dataProcedimiento = {
        titulo:procedimiento.titulo,
        estatus:procedimiento.estatus,
        parrafos:JSON.stringify(procedimiento.parrafos)
    }

    let update:InsertResult = await MySqlConnPool.executeUpdate(queryDenuncia, dataProcedimiento,Number.parseInt(id));

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