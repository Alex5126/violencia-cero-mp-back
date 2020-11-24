export interface Procedimiento {
    id: number;
    titulo: string;
    estatus: string;
    parrafos: Parrafo[];
}

export interface Parrafo{
    subtitulo:string;
    texto:string;
}