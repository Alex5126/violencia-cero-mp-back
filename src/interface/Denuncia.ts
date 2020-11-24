export interface Denuncia {
    id: number;
    idUsuario:number;
    estatus:String;
    fechaSolicitud: String;
    descripcionProblema:String;
    tipoAyuda:String;
    solicitante:Solicitante;
    denunciado:Denunicado;
}

export interface Solicitante{
    id: number;
    idDenuncia:Number;
    nombres:String;
    apellidoPaterno:String;
    apellidoMaterno:String;
    genero:String;
    edad:Number;
    telefono:String;
    lugarNacimiento:String;
    domicilio:String;
    codigoPostal:String;
    escolaridad:String;
    edoCivil:String;
    ocupacion:String;
}

export interface Denunicado{
    id:Number;
    idDenuncia:Number;
    nombres:String;
    apellidoPaterno:String;
    apellidoMaterno:String;
    parentesco:String;
    edad:Number;
    ocupacion:String;
    domicilio:String;
    codigoPostal:String;
    tipoViolencia:String;
}

export interface SearchComplaint{
    status:String;
    dateIni:String;
    dateFin:String;
}