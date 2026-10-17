import Express, { CookieOptions } from "express"
import { DbContext } from "./database/db";
import setMiddleware from "./middleware/index"
import index_router from "./routers/index"
import ENV from "dotenv"
import cookieParser from "cookie-parser";
import fs from "fs"
import https from "https"
import path from "path";
import cors from "cors"
import { Socket_controler } from "./controlers/socket_controler";
// import { ESocketType } from "../../Heders/interfaces";

ENV.config({path: __dirname + "/../.env"})

const app = Express();
const proto = process.env.PROTO || "http";
const host =  process.env.HOST || "localhost";
const port =  process.env.PORT || 20000;

const frontEndProto = process.env.FRONT_PROTO || "http"
const frontEndHost =  process.env.FRONT_HOST || "localhost"
const frontEndPort =  process.env.FRONT_PORT || 45000

// const frontEndPortVoice =  process.env.FRONT_PORT_VOICE  || 45001
// const frontEndProtoVoice = process.env.FRONT_PROTO_VOICE || "http"
// const frontEndHostVoice =  process.env.FRONT_HOST_VOICE  || "localhost"

// const frontEndPortVideo =  process.env.FRONT_PORT_VIDEO  || 45002
// const frontEndProtoVideo = process.env.FRONT_PROTO_VIDEO || "http"
// const frontEndHostVideo =  process.env.FRONT_HOST_VIDEO  || "localhost"

app.use(Express.json());
app.use(cookieParser())

app.use(cors(
    {
        origin:`${frontEndProto}://${frontEndHost}:${frontEndPort}`, 
        credentials: true
    }))

let is_secure_proto = false;

if (
    proto == "https"
    && frontEndProto == "https")
{
    is_secure_proto = true;
}

export const cookie_options: CookieOptions = {
    httpOnly:true,
    secure:is_secure_proto,
    sameSite:'lax',
    maxAge: 1000 * 60 * 60 * 2,
    path:"/"
}

app.use(index_router)

app.use(Express.static(__dirname+"/../static"))

setMiddleware(app)

DbContext.initialize()
.then(()=>{
    if (
        fs.existsSync(path.join(__dirname, "../cert", "key.pem")) &&
        fs.existsSync(path.join(__dirname, "../cert", "csr.pem")) &&
        fs.existsSync(path.join(__dirname, "../cert", "cert.pem"))
    )
    {
        const httpsServer = https.createServer({
            key: fs.readFileSync(path.join(__dirname, "../cert", "key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "../cert", "cert.pem"))
        }, app)
        
        const server = httpsServer.listen(port, ()=>{
            console.log(`${proto}://${host}:${port}`)
        })

        Socket_controler.setSocket(server, frontEndHost, frontEndProto, Number(frontEndPort));
    }
    else{
        const server = app.listen(port,()=>{
            console.log(`${proto}://${host}:${port}`)
        })
        
        Socket_controler.setSocket(server, frontEndHost, frontEndProto, Number(frontEndPort));
    }
})