import { IUser } from "./IUser"

export interface IMessage{
    id: number
    value: string
    user: IUser
}