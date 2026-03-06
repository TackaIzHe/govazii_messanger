import Logo from "./Logo";
import { parseUserCookie } from "./types/IUser";

const LeftPanel = () => {
    const user = parseUserCookie()
    const proto = process.env.REACT_APP_API_PROTO || "http";
    const host = process.env.REACT_APP_API_HOST || "localhost";
    const port = process.env.REACT_APP_API_PORT || "2000";
    return (
        <div className="left_panel">
            <Logo height={100} width={100}/>
            <img style={{width:100, height:100}} src={`${proto}://${host}:${port}/${user.ava}`}></img>
            <h1>
                Hello world {user.name}
            </h1>
        </div>
    )
}

export default LeftPanel