import mysql = require('mysql');

export class MySqlConn{
    private static _instance:MySqlConn;
    connection : mysql.Connection;
    conectado:boolean = false;

    constructor(){
        console.log('Mysql Inicializado');
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'userdb',
            password: 'passwdb',
            database: 'msegura',
            port:3506
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
