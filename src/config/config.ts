import { EmailSender } from "../utils/mailsender";

export function loadConfig() {
    process.env.CADUCIDAD_TOKEN_APP = '' + (1000 * 60 * 60 * 24 * 365);
    process.env.CADUCIDAD_TOKEN_ADM = '' + (1000 * 60 * 60 * 24);
    process.env.PORT = process.env.PORT || '' + 3000;
    process.env.SEED = process.env.SEED || 'desarrollo';
    process.env.DB_CONNECTION = process.env.DB_CONNECTION || `
            {"host": "localhost",
            "user": "userdb",
            "password": "passwdb",
            "database": "msegura",
            "port":3506}`;
    EmailSender.instance;
}