import express, {Application} from 'express';
import morgan from 'morgan';

//Route
import InedexRoute from './routes/index.routes';
import RegistrationRoute from './routes/registration.routes';
import AuthRoute from "./routes/auth.routes";
import DenunciaRoute from "./routes/denuncia.routes";
import ProcedimientoRoute from "./routes/procedimiento.routes";
import ContactosRoute from "./routes/contactos.routes";
import CentrosRoute from "./routes/centros.routes";

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
        process.env.SEED =  process.env.SEED || 'desarrollo';
        process.env.CADUCIDAD_TOKEN = ''+ (60*60*24*30);
    }

    middlewares(){
        this.app.use(morgan('dev'));
        this.app.use(express.json());
    }

    routes(){
        this.app.use(InedexRoute);
        this.app.use('/registro',RegistrationRoute);
        this.app.use('/auth',AuthRoute);
        this.app.use('/denuncias',DenunciaRoute);
        this.app.use('/procedimientos',ProcedimientoRoute);
        this.app.use('/centros',CentrosRoute);
        this.app.use('/contactos',ContactosRoute);
    }

    async listen(){
        this.app.listen(this.app.get('port'));
        console.log('Server port',this.app.get('port'));
    }
}