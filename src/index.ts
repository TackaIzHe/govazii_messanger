import Express from "express"
import { DbContext } from "./database/db";
import setMiddleware from "./middleware/index"
import index_router from "./routers/index"

const app = Express();
const port = 2000;

app.use(Express.json());


app.use(index_router)

setMiddleware(app)

DbContext.initialize()
.then(()=>{
    app.listen(port,()=>{
        console.log(`http://localhost:${port}`)
    })
})