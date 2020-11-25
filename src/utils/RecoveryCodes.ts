export default class RecoveryCodes{
    private static _instance:RecoveryCodes;
    codes : Map<String, String>;

    private constructor(){
        this.codes = new Map();
    }

    public static get instance(){
        return this._instance || (this._instance = new this());
    }

    public static createCode(key:String){
        let rand:String = this.randomNum(5);
        this.instance.codes.set(key,rand);

        return rand;
    }

    public static validCode(key:String):String{
        return this.instance.codes.get(key);
    }

    public static removeCode(key:String){
        return this.instance.codes.delete(key);
    }

    public static randomNum(num:number) {
        let text = "";
        let possible = "0123456789";
      
        for (let i = 0; i < num; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }

    public static htmlCode(code:String){

        let html:String = `<table style="font-family: Helvetica, sans-serif;width:100%;font-size: 18px">
                <tr align="center"><td><p>Código de recuperación Temporal</p></td></tr>
                <tr align="center"><td>
                    <div style="font-size: 26px;font-weight: bold;">
                        <p>${code}</p>
                    </div>
                    </td>
                </tr>
                <tr align="center">
                    <td>
                        <div style="max-width:450px;font-size:12px;">
                            <br/>
                            <p>Tu seguridad es lo más importante para nosotros, 
                            por lo que si tú no solicitaste este código, 
                            por favor comunícate a </p>
                        </div>
                    </td>
                </tr>
            </table>`;
        return html;
    }

}