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

export interface GetChatList{
    id: number
    name: string
    ava: string
}