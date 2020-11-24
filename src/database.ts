//import moduleName from 'mysql2/promise';
import { createPool,Pool,FieldPacket,RowDataPacket } from 'mysql2/promise';
import { InsertResult } from './interface/Querys';

export async function connect(){
    const connection = createPool({
        host: 'localhost',
        user: 'userdb',
        password: 'passwdb',
        database: 'msegura',
        port:3506,
        connectionLimit: 10
    });
    return connection;
}

export class MySqlConnPool{
    private static _instance:MySqlConnPool;
    connectionPool : Pool;
    conectado:boolean = false;

    constructor(){
        console.log('Mysql Inicializado');
        this.connectionPool = createPool({
            host: 'localhost',
            user: 'userdb',
            password: 'passwdb',
            database: 'msegura',
            port:3506,
            connectionLimit: 10
        });

        //this.conectarDB();
    }

    private conectarDB(){
        // this.connectionPool.connect((err)=>{

        //     if(err){
        //         console.log(err.message);
        //         return;
        //     }
        //     console.log("Conectado");
        // });
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    public static async executeQuery(query:string){
        let result = await this.instance.connectionPool.query(query);
        //console.log(result);
        return JSON.stringify(result[0]);
    }

    public static async executeInsert(query:string,data:Object):Promise<InsertResult>{
        let result = await this.instance.connectionPool.query(query,data);
        return JSON.parse(JSON.stringify(result[0]));
    }

    public static async executeUpdate(query:string,data:Object,id:Number):Promise<InsertResult>{
        let result = await this.instance.connectionPool.query(query,[data,id]);
        //console.log(JSON.stringify(result[0]));
        return JSON.parse(JSON.stringify(result[0]));
    }
}