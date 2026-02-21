import Express from "express"
import { DbContext } from "./database/db";
import setMiddleware from "./middleware/index"
import index_router from "./routers/index"
import ENV from "dotenv"
import cookieParser from "cookie-parser";

ENV.config({path: __dirname + "/../.env"})

const app = Express();
const port = process.env.PORT || 20000;

app.use(Express.json());
app.use(cookieParser())


app.use(index_router)

setMiddleware(app)

DbContext.initialize()
.then(()=>{
    app.listen(port,()=>{
        console.log(`http://localhost:${port}`)
    })
})