import { Server } from "socket.io"

declare module "http"{
    interface IncomingMessage{
        cookies:Record<string,string>
    }
}
