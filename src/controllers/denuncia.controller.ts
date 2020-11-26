import {Request, Response} from 'express';
import { DenunciaInfo } from "../interface/Listas";
import { Denuncia,Denunicado,SearchComplaint,Solicitante } from "../interface/Denuncia";
import { InsertResult} from "../interface/Querys";

import {MySqlConn} from '../database2';
import {MySqlConnPool} from '../database';
import DenunciaDBModel from "../models/DenunciaDBModel";
import { LoginPayload } from '../interface/Payloads';
import { notificaDenunciaPanel } from '../utils/Notifications';
import { getParamConfig } from '../utils/ParametersConfig';
import { ConfigParam } from '../interface/Config';
import { EmailSender } from '../utils/mailsender';

export async function getList(req:any, res:Response){

    let usuario:LoginPayload = req.usuarioPayload;

    console.log(usuario.usuario);
    
    const consulta = "SELECT d.id,d.estatus,u.email,d.fechaSolicitud,"+
                "s.nombres,s.apellidoPaterno,s.apellidoMaterno,d.idUsuario"+
                " FROM denuncias d "+
                " INNER JOIN solicitantes s ON d.id = s.iddenuncia " +
                " INNER JOIN usuariosapp u ON d.idUsuario = u.id " +
                " WHERE d.estatus IN ('NUEVO','PROCESO')";

    MySqlConn.executeQuery(consulta, (err:any, denuncias:DenunciaDBModel[])=>{
        if(err){
            res.status(400).json({
                status:false,
                error:err
            })
        }else{

            console.log(denuncias.length);
            let denArray:DenunciaInfo[] = new Array;
            for(let i= 0;i<denuncias.length;i++){
                //console.log(denuncias[i]);
                denArray.push({
                    id:denuncias[i].id,
                    estatus:denuncias[i].estatus,
                    fechaSolicitud:denuncias[i].fechaSolicitud,
                    nombreSolicitante:denuncias[i].nombres+" "+denuncias[i].apellidoPaterno+" "+denuncias[i].apellidoMaterno,
                    usuarioSolicitante:denuncias[i].email+""
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

    const consultaDenuncia = "SELECT * FROM denuncias d "+
                "WHERE d.id = "+id;

    const consultaSolicitante = "SELECT * FROM solicitantes s " +
        "WHERE s.idDenuncia = "+id;
    const consultaDenunciado = "SELECT * FROM denunciados s " +
        "WHERE s.idDenuncia = "+id;

    let denuncia = MySqlConnPool.executeQuery(consultaDenuncia);
    let solicitante = MySqlConnPool.executeQuery(consultaSolicitante);
    let denunciado = MySqlConnPool.executeQuery(consultaDenunciado);



    let denunciaRes:Denuncia[] = JSON.parse((await denuncia).toString());
    let denunciadoRes:Denunicado[] = JSON.parse((await denunciado).toString());
    let solicitanteRes:Solicitante[] = JSON.parse((await solicitante).toString());

    denunciaRes[0].denunciado = denunciadoRes[0];
    denunciaRes[0].solicitante = solicitanteRes[0];

    if(denuncia !== null){
        
        res.json(
            denunciaRes[0]
        );
    }

}

export async function addElement(req:any, res:Response){

    let denuncia:Denuncia = req.body;
    let usuario:LoginPayload = req.usuarioPayload;

    let queryDenuncia = 'INSERT INTO denuncias SET ?';
    let querySolicitante = 'INSERT INTO solicitantes SET ?';
    let queryDenunciado = 'INSERT INTO denunciados SET ?';

    let dataDenuncia = {
        estatus:'NUEVO',
        idUsuario:usuario.id,
        descripcionProblema:denuncia.descripcionProblema,
        tipoAyuda:denuncia.tipoAyuda
    }

    let insert:InsertResult = await MySqlConnPool.executeInsert(queryDenuncia, dataDenuncia);
    
    if(insert.affectedRows === 1){

        denuncia.solicitante.idDenuncia = insert.insertId;

        delete denuncia.solicitante.id;
        await MySqlConnPool.executeInsert(querySolicitante, denuncia.solicitante);

        denuncia.denunciado.idDenuncia = insert.insertId;
        delete denuncia.denunciado.id;
        await MySqlConnPool.executeInsert(queryDenunciado, denuncia.denunciado);

        let html:String = notificaDenunciaPanel(denuncia);
        let param:ConfigParam = await getParamConfig("EMAIL_NOTIFY");

        EmailSender.sendMailHtml(param.value, `Notificacion de denuncia ID ${insert.insertId}`, html);

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

    let denuncia:Denuncia = req.body;
    const id = req.params.id;

    let queryDenuncia = 'UPDATE denuncias SET ? WHERE id = ?';
    let querySolicitante = 'UPDATE solicitantes SET ? WHERE idDenuncia = ?';
    let queryDenunciado = 'UPDATE denunciados SET ? WHERE idDenuncia = ?';

    let dataDenuncia = {
        estatus:denuncia.estatus,
        descripcionProblema:denuncia.descripcionProblema,
        tipoAyuda:denuncia.tipoAyuda
    }

    let insert:InsertResult = await MySqlConnPool.executeUpdate(queryDenuncia, dataDenuncia,Number.parseInt(id));
    
    if(insert.affectedRows === 1){

        await MySqlConnPool.executeUpdate(querySolicitante, denuncia.solicitante,denuncia.id);

        await MySqlConnPool.executeUpdate(queryDenunciado, denuncia.denunciado,denuncia.id);

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

export async function getHistory(req:any, res:Response){

    let search:SearchComplaint = req.body;

    console.log(search);

    //let joinStatus = search.status
    
    const consulta = "SELECT d.id,d.estatus,u.email,d.fechaSolicitud,"+
                "s.nombres,s.apellidoPaterno,s.apellidoMaterno,d.idUsuario"+
                " FROM denuncias d "+
                " INNER JOIN solicitantes s ON d.id = s.iddenuncia " +
                " INNER JOIN usuariosapp u ON d.idUsuario = u.id " +
                " WHERE d.estatus IN ('"+search.status+"') AND "+
                " d.fechaSolicitud >'"+search.dateIni+"' AND d.fechaSolicitud < '"+search.dateFin+"'";

    console.log(consulta);

    MySqlConn.executeQuery(consulta, (err:any, denuncias:DenunciaDBModel[])=>{
        if(err){
            res.status(400).json({
                status:false,
                error:err
            })
        }else{

            console.log(denuncias.length);
            let denArray:DenunciaInfo[] = new Array;
            for(let i= 0;i<denuncias.length;i++){
                //console.log(denuncias[i]);
                denArray.push({
                    id:denuncias[i].id,
                    estatus:denuncias[i].estatus,
                    fechaSolicitud:denuncias[i].fechaSolicitud,
                    nombreSolicitante:denuncias[i].nombres+" "+denuncias[i].apellidoPaterno+" "+denuncias[i].apellidoMaterno,
                    usuarioSolicitante:denuncias[i].email+""
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