import { NextFunction, Request, Response } from "express";

const log_middleware = (level: number) => {
    return (req: Request) => {
        try {
            if (level > 0) {
                console.log("------------------------------------------------------------------------")
                console.log("------------------------------------------------------------------------")
                console.log(`Timestamp ${new Date().toISOString()}`)
                console.log(`Host: ${req.host}`)
                console.log(`HostName: ${req.hostname}`)
                console.log(`ip: ${req.ip}`)
                console.log(`ips: ${req.ips}`)
            }
            if (level > 1) {
                console.log("------------------------------------------------------------------------")

                console.log(`httpV: ${req.httpVersion}`)
                console.log(`OriginalUrl: ${req.originalUrl}`)
                console.log(`BaseUrl: ${req.baseUrl}`)
                console.log(`URL: ${req.url}`)
                console.log(`Method: ${req.method}`)
                console.log(`Protocol: ${req.protocol}`)
                console.table(`Headers: ${JSON.stringify(req.headers, null, 2)}`)
                console.table(`Cookies: ${JSON.stringify(req.cookies, null, 2)}`)
                console.table(`Params: ${JSON.stringify(req.params, null, 2)}`)
                console.table(`Body: ${JSON.stringify(req.body, null, 2)}`)
            }
            if (level > 2) {
                const socketInfo = {
                    remoteAddress: req.socket.remoteAddress,
                    remoteFamily: req.socket.remoteFamily,
                    remotePort: req.socket.remotePort,
                    localAddress: req.socket.localAddress,
                    localPort: req.socket.localPort,
                    localFamily: req.socket.localFamily,
                };
                console.log("------------------------------------------------------------------------")

                console.log(`Path: ${req.path}`)
                console.log(`RawHeaders: ${req.rawHeaders}`)
                console.log(`RawTrailers: ${req.rawTrailers}`)
                console.table(`Route: ${JSON.stringify(req.route, null, 2)}`)
                console.log(`Secure: ${req.secure}`)
                // console.log(`SignedCookies: ${req.signedCookies}`)
                console.table(`Socket: ${JSON.stringify(socketInfo, null, 2)}`)
                console.log(`Stale: ${req.stale}`)
                console.log(`Subdomains: ${req.subdomains}`)
                console.table(`Trailers: ${JSON.stringify(req.trailers, null, 2)}`)
                console.table(`TrailersDistinct: ${JSON.stringify(req.trailersDistinct, null, 2)}`)
                console.log(`XHR: ${req.xhr}`)
                console.log(`Fresh: ${req.fresh}`)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}

export default log_middleware