import { Socket } from "socket.io"
import { User } from "../entity/user"
import { DbContext } from "../database/db"
import { Cookie_info } from "../objects/jwt_payload"
import {ESocketType} from "../../../Heders/interfaces"

/*-------------------------------------------------------------------------------------*/

declare module "socket.io" {
    interface Socket {
        // static connections: Map<string, Socket>
        // static voiceStreams: Map<string, Socket>
        // static videoStreams: Map<string, Socket>
        call_state: number;
        user: User | undefined;
        cookie: Cookie_info | undefined;
        call_room: string;
        call_room_id: number;


        // async get_user(): Promise<User | undefined>;
        // async set_user(): Promise<number>;
        // async set_connect(): Promise<number>;
        // async get_connect(): Promise<string>;
        // async find_user(): Promise<User | undefined>;
        // async set_user_connections(connection_type: ESocketType): Promise<number>
        // verify_cookie(): void;

    }
}

/*-------------------------------------------------------------------------------------*/

// export class SocketUser extends Socket {

// /*-------------------------------------------------------------------------------------*/

//     constructor(socket: Socket)
//     {
//         super();
//         this = socket;
//     }

// /*-------------------------------------------------------------------------------------*/

//     verify_cookie(): void 
//     {
//         try {
//             this.cookie = undefined;

//             if (!this.request)
//                 return

//             if (!this.request.cookies)
//                 return

//             const { Session } = this.request.cookies;
//             if (typeof Session == "undefined")
//                 return;

//             const token = verify_jwt(Session)
//             if (typeof token == "undefined")
//                 return;

//             const parseCookie: Cookie_info = token;
//             this.cookie = parseCookie;
//         }
//         catch (e) {
//             console.log(e)
//         }
//     }

// /*-------------------------------------------------------------------------------------*/

//     async get_user(): Promise<User>
//     {
//         this.verify_cookie()

//         if (this.cookie === undefined)
//             return

//         return this.user;
//     }

// /*-------------------------------------------------------------------------------------*/

//     async set_user(): Promise<number>
//     {
//         this.verify_cookie()

//         if (this.cookie === undefined)
//             return -1;

//         const userRepo = DbContext.getRepository(User);
//         const findUser = await userRepo.findOne({ where: { id: this.cookie.id } })

//         if (findUser) {
//             this.user = findUser;
//             return this.user.id;
//         }
//         else {
//             this.user = undefined;
//             return -1;
//         }
//     }

//     async find_user(): Promise<User>
//     {
//         this.verify_cookie()

//         if (this.cookie === undefined)
//             return undefined;

//         const userRepo = DbContext.getRepository(User);
//         const findUser = await userRepo.findOne({ where: { id: this.cookie.id } })

//         if (findUser) {
//             return findUser;
//         }
//         else {
//             return undefined;
//         }
//     }

// /*-------------------------------------------------------------------------------------*/

//     async set_user_connections(connection_type: ESocketType): Promise<number>
//     {
//         const user = await this.find_user()
//         const userRepo = DbContext.getRepository(User);
//         if (user === undefined)
//             return -1;

//         switch (connection_type)
//         {
//             case ESocketType.Msg:
//                 user.socketMsgId = this.connections.get(this.id);
//                 break;

//             case ESocketType.Voice:
//                 user.socketVoiceId = this.voiceStreams.get(this.id);
//                 break;

//             case ESocketType.Video:
//                 user.socketVideoId = this.videoStreams.get(this.id);
//                 break;
//         }

//         await userRepo.save(user);
//         return 0;
//     }

// /*-------------------------------------------------------------------------------------*/

// }

// /*-------------------------------------------------------------------------------------*/
