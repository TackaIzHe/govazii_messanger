import Cookie from "js-cookie"

export interface IUser{
    id: number
    ava: string
    name: string
    role: string
}

export interface RegUser{
    name: string;
    email: string;
    password: string;
}

export interface AuthUser{
    email: string;
    password: string;
}

export const parseUserCookie = () => {
    const cookieUser = Cookie.get('user') || "";
    const user:IUser = JSON.parse(cookieUser.split("j:")[1])
    return user
}