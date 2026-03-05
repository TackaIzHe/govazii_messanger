import Express from "express"
import { DbContext } from "./database/db";
import setMiddleware from "./middleware/index"
import index_router from "./routers/index"
import ENV from "dotenv"
import cookieParser from "cookie-parser";
import fs from "fs"
import https from "https"
import path from "path";
import cors from "cors"

ENV.config({path: __dirname + "/../.env"})

const app = Express();
const port = process.env.PORT || 20000;

const frontEndHost = process.env.FRONT_HOST || "localhost"
const frontEndPort = process.env.FRONT_PORT || 45000
const frontEndProto = process.env.FRONT_PROTO || "http"

app.use(Express.json());
app.use(cookieParser())

app.use(cors({origin:`${frontEndProto}://${frontEndHost}:${frontEndPort}`}))

app.use(index_router)

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

        httpsServer.listen(port, ()=>{
            console.log(`https://localhost:${port}`)
        })
    }
    else{
        app.listen(port,()=>{
            console.log(`http://localhost:${port}`)
        })
    }
})