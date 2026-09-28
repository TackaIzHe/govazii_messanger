import cookieParser from "cookie-parser"
import { Server } from "socket.io";

function cp(secret?: string | string[], options?: cookieParser.CookieParseOptions) {
  var parser:any = cookieParser(secret, options)

  return function (socket:any, next:any) {
    parser(socket.request, null, next);
  }
};

function setCookieParser(server:Server) {
    server.use(cp())
}

export default setCookieParser