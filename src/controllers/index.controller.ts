import {Request, Response} from 'express';

export async function indexWelcome(req:Request,res:Response){
    res.json('Welcome to API');
};