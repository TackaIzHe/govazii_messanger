import cookieParser from "cookie-parser"

function cp(secret?: string | string[], options?: cookieParser.CookieParseOptions) {
  var parser:any = cookieParser(secret, options)

  return function (socket:any, next:any) {
    parser(socket.request, null, next);
  }
};

function setCookieParser(server:any) {
    server.use(cp())
} 
export default setCookieParser