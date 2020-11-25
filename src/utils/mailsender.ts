import nodemailer = require('nodemailer');
import { MySqlConnPool } from '../database';
import { MySqlConn } from '../database2';
import { ConfigParam } from '../interface/Config';
import { stringToMapPams } from './Utils';

export class EmailSender{
    private static _instance:EmailSender;
    transporter : nodemailer.Transporter;
    conectado:boolean = false;

     constructor(){
        console.log('Email Inicializado');

        this.createTransporter();
    }

    private createTransporter(){
        
        // let configDb = await MySqlConnPool.executeQuery("SELECT * FROM config WHERE param = 'EMAIL_CONFIG'");

        
        // console.log(configDb);

        // let config:ConfigParam[] = JSON.parse((configDb).toString());

        // let emailConfig :Map<string,string> = stringToMapPams(config[0].value,"\\|","=");

        // this.transporter = nodemailer.createTransport({
        //     host: emailConfig.get("SMTP"),
        //     port: Number.parseInt(emailConfig.get("PORT")),
        //     secure: false, // true for 465, false for other ports
        //     auth:{
        //         user:emailConfig.get("EMAIL"),
        //         pass:emailConfig.get("PASS")
        //     }
        // });

        MySqlConn.executeQuery("SELECT * FROM config WHERE param = 'EMAIL_CONFIG'", (err:any, config:ConfigParam[])=>{
            if(config){
                console.log(config[0].value);
                let emailConfig :Map<string,string> = stringToMapPams(config[0].value,"|","=");
                //console.log(emailConfig);
                this.transporter = nodemailer.createTransport({
                    host: emailConfig.get("SMTP"),
                    port: Number.parseInt(emailConfig.get("PORT")),
                    secure: false, // true for 465, false for other ports
                    auth:{
                        user:emailConfig.get("EMAIL"),
                        pass:emailConfig.get("PASS")
                    }
                });
            }
        });
    }

    public static get instance(){
        this._instance || (this._instance = new this());
        return this._instance;
    }

    public static sendMail(mailOptions:Object):boolean{
        let result:boolean = false;
        this.instance.transporter.sendMail(mailOptions, (error,info ) =>{
            console.log("senMail returned!");
            if (error) {
                console.log("ERROR!!!!!!", error);
                result = false;
            } else {
                console.log('Email sent: ' + info.response);
                result = true;
            }
        });
        console.log(result);
        return result;
    }

}