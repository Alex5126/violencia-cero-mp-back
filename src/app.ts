import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';

//Route
import InedexRoute from './routes/index.routes';
import RegistrationRoute from './routes/registroapp.routes';
import UserAppRoute from "./routes/appusers.routes";
import DenunciaRoute from "./routes/denuncia.routes";
import ProcedimientoRoute from "./routes/procedimiento.routes";
import InformacionRoute from "./routes/informacion.routes";
import ContactosRoute from "./routes/contactos.routes";
import CentrosRoute from "./routes/centros.routes";
import AdminRoute from "./routes/adminusers.routes";
import AdminRegistroRoute from "./routes/registroadmin.routes";
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
        this.app.use(cors());
    }

    routes(){
        this.app.use(InedexRoute);
        this.app.use('/usuario',RegistrationRoute);
        this.app.use('/perfil',UserAppRoute);
        this.app.use('/denuncias', validaToken, DenunciaRoute);
        this.app.use('/procedimientos',ProcedimientoRoute);
        this.app.use('/informacion',InformacionRoute);
        this.app.use('/centros',CentrosRoute);
        this.app.use('/contactos',ContactosRoute);
        this.app.use('/admin',AdminRegistroRoute);
        this.app.use('/admin/perfil',validaToken, AdminRoute);
    }

    async listen(){
        this.app.listen(this.app.get('port'));
        console.log('Server port',this.app.get('port'));
    }
}