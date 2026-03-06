import { FormEvent, useState } from "react";
import Form, { Field } from "./Form";
import axios from "axios";
import { RegUser } from "./types/IUser";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [submit, setSubmit]= useState("Регистрация");
    
    const sendRegVal = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetchVal()
    }
    
    const fetchVal = async() =>{
        if (
            name.length != 0 ||
            email.length != 0 ||
            password.length != 0
        )
        {
            const sendObj:RegUser = {
                name:name,
                email:email,
                password:password
            }
            const proto = process.env.REACT_APP_API_PROTO || "http";
            const host = process.env.REACT_APP_API_HOST || "localhost";
            const port = process.env.REACT_APP_API_PORT || "2000";
            const res = await axios.post(`${proto}://${host}:${port}/user/register`, sendObj);
            }
        }

    const fields:Field[] = [
        {name:"name", type:"text", value:name, setVal:setName, onClick: ()=>{}},
        {name:"email", type:"email", value:email, setVal:setEmail, onClick: ()=>{}},
        {name:"password", type:"password", value:password, setVal:setPassword, onClick: ()=>{}},
        {name:"submit_button", type:"submit", value:submit, setVal:setSubmit, onClick: undefined}
    ]
    
    return (
        <div>
            <Form name="register" width={500} height={100} fields={fields} submit={sendRegVal}/>
        </div>
    )
}

export default Register