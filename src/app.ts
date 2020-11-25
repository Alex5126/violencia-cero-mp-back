import express, {Application} from 'express';
import morgan from 'morgan';

//Route
import InedexRoute from './routes/index.routes';
import RegistrationRoute from './routes/registration.routes';
import UserAppRoute from "./routes/appusers.routes";
import DenunciaRoute from "./routes/denuncia.routes";
import ProcedimientoRoute from "./routes/procedimiento.routes";
import ContactosRoute from "./routes/contactos.routes";
import CentrosRoute from "./routes/centros.routes";
import AdminRoute from "./routes/adminusers.routes";
import { validaToken } from './filters/autenticacion';
import { loadConfig } from "./config/config";

export class App{

    private app:Application;

    constructor(private port?:number | string){
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    settings(){
        this.app.set('port',this.port || process.env.PORT || 3000);
        loadConfig();
    }

    middlewares(){
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }

    routes(){
        this.app.use(InedexRoute);
        this.app.use('/usuario',RegistrationRoute);
        this.app.use('/perfil',UserAppRoute);
        this.app.use('/denuncias', validaToken, DenunciaRoute);
        this.app.use('/procedimientos',ProcedimientoRoute);
        this.app.use('/centros',CentrosRoute);
        this.app.use('/contactos',ContactosRoute);
        this.app.use('/admin',AdminRoute);
    }

    async listen(){
        this.app.listen(this.app.get('port'));
        console.log('Server port',this.app.get('port'));
    }
}