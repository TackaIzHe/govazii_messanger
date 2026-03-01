import { IUser } from "./IUser"

export interface IChat{
    id: number
    ava: string
    author: IUser
    name: string
}