import nodemailer = require('nodemailer');

export class EmailSender{
    private static _instance:EmailSender;
    transporter : nodemailer.Transporter;
    conectado:boolean = false;

    constructor(){
        console.log('Email Inicializado');
        this.transporter = nodemailer.createTransport({
            host: 'mail.contravel.com.mx',
            port: 26,
            secure: false, // true for 465, false for other ports
            auth:{
                user:"hoteles@contravel.com.mx",
                pass:"hotcon12"
            }
        });
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    public static sendMail(mailOptions:Object){
        this.instance.transporter.sendMail(mailOptions, (error,info ) =>{
            console.log("senMail returned!");
            if (error) {
                console.log("ERROR!!!!!!", error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

}