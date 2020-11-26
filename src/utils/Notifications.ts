import {Denuncia} from "../interface/Denuncia";

export function notificaDenunciaPanel(denuncia:Denuncia):String{

    let html:String = `
    <table style="font-family: Helvetica, sans-serif;width:100%;">
        <tr align="center"><td>
            <p style="font-size:26px;font-weight:bold;">Notificacion de denuncia</p></td>
        </tr>
        <tr align="center">
            <td>
                <div>
                    <table style="text-align: left;">
                        <tr>
                            <td style="font-weight: bold;">Descripcion</td>
                            <td>${denuncia.descripcionProblema}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Tipo Ayuda</td>
                            <td>${denuncia.tipoAyuda}</td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        <tr><td><hr/></td></tr>
        <tr align="center">
            <td>
                <div>
                    <table style="text-align: left;">
                        <tr>
                            <td style="font-weight: bold;">Solictante</td>
                            <td>${denuncia.solicitante.nombres} ${denuncia.solicitante.apellidoPaterno} ${denuncia.solicitante.apellidoMaterno}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Direccion</td>
                            <td>${denuncia.solicitante.domicilio}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Ocupacion</td>
                            <td>${denuncia.solicitante.ocupacion}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Edad</td>
                            <td>${denuncia.solicitante.edad}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Telefono</td>
                            <td>${denuncia.solicitante.telefono}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Edo Civil</td>
                            <td>${denuncia.solicitante.edoCivil}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Codigo Postal</td>
                            <td>${denuncia.solicitante.codigoPostal}</td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        <tr><td><hr/></td></tr>
        <tr align="center">
            <td>
                <div>
                    <table style="text-align: left;">
                        <tr>
                            <td style="font-weight: bold;">Denunciado</td>
                            <td>${denuncia.denunciado.nombres} ${denuncia.denunciado.apellidoPaterno} ${denuncia.denunciado.apellidoMaterno}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Direccion</td>
                            <td>${denuncia.denunciado.domicilio}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Parentesco</td>
                            <td>${denuncia.denunciado.parentesco}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Edad</td>
                            <td>${denuncia.denunciado.edad}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Tipo Violencia</td>
                            <td>${denuncia.denunciado.tipoViolencia}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: bold;">Ocupacion</td>
                            <td>${denuncia.denunciado.ocupacion}</td>
                        </tr>
                    </table>
                </div>
            </td>
        </tr>
        <tr align="center">
            <td>
                <div style="max-width:450px;font-size:12px;">
                    <br/>
                    <p> </p>
                </div>
            </td>
        </tr>
    </table>
    `;

    return html;
}

export function notificaDenunciaUsuario(){

}