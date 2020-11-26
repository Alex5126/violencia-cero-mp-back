import mysql = require('mysql');
import { ConnectionDb } from './models/ConnectionDb';

export class MySqlConn{
    private static _instance:MySqlConn;
    connection : mysql.Connection;
    conectado:boolean = false;

    constructor(){
        console.log('Mysql Inicializado');
        let conn:ConnectionDb = JSON.parse(process.env.DB_CONNECTION);
        
        this.connection = mysql.createConnection({
            host: conn.host,
            user: conn.user,
            password: conn.password,
            database: conn.database,
            port:conn.port
        });

        this.conectarDB();
    }

    private conectarDB(){
        this.connection.connect((err)=>{

            if(err){
                console.log(err.message);
                return;
            }
            console.log("Conectado");
        });
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    public static executeQuery(query:string, callback:Function){
        this.instance.connection.query(query, (err,results:Object[], fields ) =>{
            if(err){
                console.log('Error en query');
                console.log(err);
                return callback(err);
            }

            if(results.length === 0){
                callback('No hay registros');
            }else{
                callback(null, results);
            }
        });
    }
}
