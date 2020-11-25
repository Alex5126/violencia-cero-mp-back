
export function stringToMapPams(parametros:String, splitChar:string, igualChar:string){
    let mapa : Map<string, string > = new Map();
    let parejas:string[] = parametros.split(splitChar);

    parejas.forEach(
        pareja => {
            if (pareja.length > 0) {
                let llaves_valores:string[] = pareja.split(igualChar);
                mapa.set(llaves_valores[0].trim(), llaves_valores.length === 1 ? null : llaves_valores[1].trim());
            }
        }
    );
    return mapa;
}
