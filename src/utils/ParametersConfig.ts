import { MySqlConnPool } from "../database";
import { ConfigParam } from "../interface/Config";

export async function getParamConfig(param:String):Promise<ConfigParam>{
    
    let resp:String = await MySqlConnPool.executeQuery("SELECT * FROM config WHERE param = '"+param+"'");

    let paramResp:ConfigParam[] = JSON.parse((resp).toString());

    return paramResp[0];
}