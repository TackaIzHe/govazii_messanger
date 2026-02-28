import log_middleware from "../log_middleware";

export class Error_api extends Error{
    code:number;
    val:string;
    callBack:Function
    logLevel:number
    constructor(code:number, val:string, callBack:Function, logLevel:number){
        super()
        this.code = code;
        this.val = val;
        this.callBack = callBack;
        this.logLevel = logLevel;
    }

    static badData()
    {
        return new Error_api(406, "Bad Data!!!!",log_middleware(3), 3);
    }
    static serverError()
    {
        return new Error_api(500, "Internal server error!!!!", log_middleware(2), 2);
    }
    static pageNotFound()
    {
        return new Error_api(404, "Иди отсюда!!!!!!!!", log_middleware(1), 1);
    }
    static notFound()
    {
        return new Error_api(404, "Not found", log_middleware(0), 0);
    }
    static emailExist()
    {
        return new Error_api(404, "Email exist", log_middleware(0), 0);
    }
    static badTryLogIn()
    {
        return new Error_api(404, "Куда лезим", log_middleware(3), 3);
    }
}
