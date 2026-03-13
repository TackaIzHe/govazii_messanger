export interface Cookie_info{
    id:number
    name:string
    role:string                             
}

export class Jwt_payload implements Cookie_info{
    id:number
    name:string
    role:string

    constructor(id:number, name:string, role:string)
    {
        this.id = id;
        this.name = name;
        this.role = role;
    }
}