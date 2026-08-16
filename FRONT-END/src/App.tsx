import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Register from "./components/Register";
import Login from "./components/Login";
import React, { FormEvent, RefObject, SyntheticEvent, useEffect, useRef, useState } from 'react';
import Cookie from 'js-cookie'
import { MessageProps } from './components/ListMessage';
import {io, Socket} from "socket.io-client"
import { CreateChat, DialogList, GetChatList } from './components/types/IChat';
import Dialog from './components/Dialog';
import { DialogProp} from './components/Dialog';
import Logo from './components/Logo';
import style from "./styles/loginAuthPage.module.css";
import Form, { Field } from './components/Form';
import axios from 'axios';

export interface AppProps{
  createChat: [number, React.Dispatch<React.SetStateAction<number>>]
  createChatEvent: [number, React.Dispatch<React.SetStateAction<number>>]
  createMessage: [number, React.Dispatch<React.SetStateAction<number>>]
  createMessageEvent: [number, React.Dispatch<React.SetStateAction<number>>]
  chatId: [number, React.Dispatch<React.SetStateAction<number>>]
  chatMessage: [MessageProps[], React.Dispatch<React.SetStateAction<MessageProps[]>>]
  chatInfo: [GetChatList, React.Dispatch<React.SetStateAction<GetChatList>>]
  switchAll:Function
  socket: Socket
  panel_ref: RefObject<HTMLDivElement | null>
  hiden_func: Function
  dialog_ref_array: RefObject<HTMLDialogElement[]>
}

const createSocket = () => {
  interface ServerToClientEvents {
    "roomMsg": (msg: string) => void;
  }

  interface ClientToServerEvents {
    'chat message': (msg: string) => void;
  }
  
  const proto = process.env.REACT_APP_API_PROTO || "http";
  const host = process.env.REACT_APP_API_HOST || "localhost";
  const port = process.env.REACT_APP_API_PORT || "2000";
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`${proto}://${host}:${port}`, {withCredentials:true})
  return socket;
}
const socket = createSocket()

socket.on('connect',()=>{
  
  socket.on("disconnect", ()=>{
  })
  
});

socket.onAny((msg, asd)=>{
  if (msg.includes("room"))
    console.log(asd)
  else  
    console.log(msg)

  alert(asd)
})


function App() {
  const [state, setState]     = useState(0);
  const createChat            = useState(0);
  const createChatEvent       = useState(0);
  const createMessage         = useState(0);
  const createMessageEvent    = useState(0);
  const chatId                = useState(0);
  const chatMessage           = useState<MessageProps[]>([]);
  const chatInfo              = useState<GetChatList>({id:0,name:"", ava:""})
  const left_panel_ref        = useRef<HTMLDivElement>(null)
  const right_panel_ref       = useRef<HTMLDivElement>(null)
  const left_right_panel_ref  = useRef<HTMLDivElement>(null)
  const create_chat_modal_ref = useRef<HTMLDialogElement>(null)

  const dialog_ref_array      = useRef<HTMLDialogElement[]>(new Array())

  const [create_chat_name, set_create_chat_name] = useState<string>("");
  const [create_chat_submite,set_create_chat_submite] = useState<string>("Создать чат");

  useEffect(()=>{
    set_ref()
  },[setState])

  const switchState = () => {
    setState(state == 0 ? 1 : 0)
  }

  const switchAllCreate = (setState: [number, React.Dispatch<React.SetStateAction<number>>]) => {
    createChat[1](0);
    createMessage[1](0);

    setState[1](1)
  }

    const hide = () => {
      if (left_right_panel_ref.current)
      {
        if (left_right_panel_ref.current.style.animationName == "slideout" ||
                !left_right_panel_ref.current.style.animationName)
        {
            left_right_panel_ref.current.style.animationName = "slidein"
            left_right_panel_ref.current.style.gridTemplateColumns = "6.2vw 93.8vw"
        }
        else if (left_right_panel_ref.current.style.animationName == "slidein")
        {
            left_right_panel_ref.current.style.animationName = "slideout"
            left_right_panel_ref.current.style.gridTemplateColumns = "30vw 70vw"
        }
      }
    }
    const create_chat_fields:Field[] = [
                {name:"chat_name", type:"chat_name", value:create_chat_name, setVal:set_create_chat_name, onClick: ()=>{}},
                {name:"submit_button", type:"submit", value:create_chat_submite, setVal:set_create_chat_submite, onClick: undefined}
            ]
    const create_chat = (e:FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (create_chat_name.length == 0)
      {
        alert("Некоретные данные")
        return
      }
      const sendObj:CreateChat = {
          name: create_chat_name,
      }
      const proto = process.env.REACT_APP_API_PROTO || "http";
      const host = process.env.REACT_APP_API_HOST || "localhost";
      const port = process.env.REACT_APP_API_PORT || "2000";
      try{
        axios.post(`${proto}://${host}:${port}/chat`, sendObj, {withCredentials:true})
      }
      catch(e)
      {
          alert("Ошибка создания чата")
      }
    }

    const set_ref = () => {
      if (create_chat_modal_ref.current){
        dialog_ref_array.current.push(create_chat_modal_ref.current);
      }
    }
  
  return (
    <div>
      {
        Cookie.get('user') ? (
        <div >
          <Dialog classname='create_chat' ref={create_chat_modal_ref}>
            <div>
              <Form name="auth" width={500} height={100} fields={create_chat_fields} submit={create_chat}/>
            </div>
          </Dialog>
          <div className='left_right_panel' ref={left_right_panel_ref}>
            <LeftPanel createChat={createChat} createChatEvent={createChatEvent} 
              createMessage={createMessage} createMessageEvent={createMessageEvent} switchAll={switchAllCreate}
              chatId={chatId} chatMessage={chatMessage} chatInfo={chatInfo} socket={socket}
              panel_ref={left_panel_ref} hiden_func={hide} dialog_ref_array={dialog_ref_array}/>
            <RightPanel createChat={createChat} createChatEvent={createChatEvent}
              createMessage={createMessage} createMessageEvent={createMessageEvent} switchAll={switchAllCreate}
              chatId={chatId} chatMessage={chatMessage} chatInfo={chatInfo} socket={socket}
              panel_ref={right_panel_ref} hiden_func={hide} dialog_ref_array={dialog_ref_array}/>
          </div>
        </div>
        ) : state ? (
          <div className={style.Body}>
            <div className={style.LoginAuth}>
              <Register/>
              <button onClick={switchState}>На страницу авторизации</button>
            </div>
          </div>
        ) : (
          <div className={style.Body}>
            <div className={style.LoginAuth}>
              <Login switchState={setState}/>
              <button onClick={switchState}>На страницу регистрации</button>
            </div>
          </div>
          )
      }
    </div>
  );
}

export default App;
