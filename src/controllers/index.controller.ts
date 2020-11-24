import {Request, Response} from 'express';

import {connect} from '../database';

export async function indexWelcome(req:Request,res:Response){

    let conn = await connect();

    const result = await conn.query('SELECT * from denuncias');

    console.log(result[0]);
    res.json('Welcome to API');
};