export interface UsuarioApp {
    id:Number;
    estatus:String;
    nombre: String;
    apellidoP:String;
    apellidoM:String;
    email: String;
    password: String;
    tel:String;
    cp:String;
}

export interface UsuarioAdm {
    id:Number;
    email:String;
    password: String;
    nombre:String;
    apellido:String;
    tipo:String;
}