export class Error_api extends Error{
    code:number;
    value:string;
    constructor(code:number, value:string){
        super()
        this.code = code;
        this.value = value;
    }

    static badData()
    {
        return new Error_api(406, "Bad Data!!!!");
    }
    static serverError()
    {
        return new Error_api(500, "Internal server error!!!!");
    }
    static pageNotFound()
    {
        return new Error_api(404, "Иди отсюда!!!!!!!!");
    }
}
