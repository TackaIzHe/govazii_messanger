import React, { FC, FormEvent, SetStateAction, useState } from "react";
import Form, { Field } from "./Form";
import { AuthUser } from "./types/IUser";
import axios from "axios";

export interface LoginProps{
    switchState:React.Dispatch<React.SetStateAction<number>>
}

const Login:FC<LoginProps> = ({
    switchState
}) => {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submit, setSubmit] = useState("Авторизация");



    const sendAuth = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        auth()
    }

    const auth = async() => {
        if (
            email.length != 0 &&
            password.length != 0
        )
        {
            const sendObj:AuthUser = {
                email: email,
                password: password
            }
            const proto = process.env.REACT_APP_API_PROTO || "http";
            const host = process.env.REACT_APP_API_HOST || "localhost";
            const port = process.env.REACT_APP_API_PORT || "2000";
            try{

                const res = await axios.post(`${proto}://${host}:${port}/user/loggin`, sendObj, {withCredentials:true});
                const resInfo = await axios.get(`${proto}://${host}:${port}/user/get/auth_user`, {withCredentials:true})
                switchState(2)
            }
            catch(e)
            {
                console.log(e);
            }
        }
    }

    const fields:Field[] = [
            {name:"email", type:"email", value:email, setVal:setEmail, onClick: ()=>{}},
            {name:"password", type:"password", value:password, setVal:setPassword, onClick: ()=>{}},
            {name:"submit_button", type:"submit", value:submit, setVal:setSubmit, onClick: undefined}
        ]
    
    return (
        <div>
            <Form name="auth" width={500} height={100} fields={fields} submit={sendAuth}/>
        </div>
    )
}

export default Login