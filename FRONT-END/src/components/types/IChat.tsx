import { IUser } from "./IUser"

export interface IChat{
    id: number
    ava: string
    author: IUser
    name: string
}

export interface CreateChat{
    name: string
}

export interface InviteUser{
    id:number
    userId:number
}

export interface GetChatList{
    id: number
    name: string
    ava: string
}

export enum DialogList {
    Ecreate_chat = 0,
    Eadd_user_to_chat = 1,
    Eopen_setings,
    Eopen_profile
}