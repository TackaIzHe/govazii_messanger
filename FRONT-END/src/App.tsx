import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Register from "./components/Register";
import Login from "./components/Login";
import React, { FormEvent, RefObject, SyntheticEvent, useEffect, useRef, useState } from 'react';
import Cookie from 'js-cookie'
import { MessageProps } from './components/ListMessage';
import {io, Socket} from "socket.io-client"
import { CreateChat, DialogList, GetChatList, InviteUser } from './components/types/IChat';
import Dialog from './components/Dialog';
import { DialogProp} from './components/Dialog';
import Logo from './components/Logo';
import style from "./styles/loginAuthPage.module.css";
import Form, { Field } from './components/Form';
import axios from 'axios';
import { AudioOptions, ECallState, EEventString, EMsgType, ESocketMsgType, MSG, SipMsg } from './components/Headers/interfaces';
import { getMessageForId } from './components/API/message';
import { send_pack_to_room, sig_to_room } from './components/API/socket';

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
  const invite_in_chat_modal_ref = useRef<HTMLDialogElement>(null)

  const dialog_ref_array      = useRef<HTMLDialogElement[]>(new Array() as HTMLDialogElement[])

  const [create_chat_name, set_create_chat_name] = useState<string>("");
  const [create_chat_submite,set_create_chat_submite] = useState<string>("Создать чат");

  const [invite_usr_id, set_invite_usr_id] = useState<number>(0);
  const [invite_usr_submite,set_invite_usr_submite] = useState<string>("Пригласить в чат");

  const voice_steam = useRef<MediaStream>(null);
  const video_steam = useRef<MediaStream>(null);
  const video_ref   = useRef<HTMLVideoElement>(null);
  const audio_ref   = useRef<HTMLAudioElement>(null);
  const alert_ref   = useRef<HTMLAudioElement>(null);
  // const [audio_options, set_audio_options] = useState<AudioOptions>()
  
  
  const audio_options:AudioOptions = {
    mimeType: 'audio/webm; codecs=opus',
    audioBitsPerSecond: 64000
  }

  // const mediaSource = new MediaSource()
  // let sourceBuffer

  
  const talk_loop = (roomId:number) => {
    let audioPacks = new Array<Blob>();
    let is_first_audio_pack = 0;
    let first_audio_pack = new Blob();
    if (voice_steam.current)
    {
      const media_record = new MediaRecorder(voice_steam.current, audio_options)
      // console.log(media_record)
      media_record.ondataavailable = async(event)=>{
        if (event.data.size > 0)
        {
          if (!(is_first_audio_pack))
            { 
            console.log(event.data)
            is_first_audio_pack = 1
            first_audio_pack = event.data;
            return;
          }
          audioPacks.push(event.data)

          if (audioPacks.length > 4)
          {
            if (audio_options)
            {

              console.log(audio_options.mimeType)
              const pack = new Blob([first_audio_pack, ...audioPacks], {type: audio_options.mimeType})
              send_pack_to_room(socket, roomId, await pack.arrayBuffer())
              audioPacks = new Array<Blob>();
            }
          }
        }
      }
      media_record.start(1000)
    }
  }

// Сдесь вопрос. Будет ли это коректно работать при условии что он обновляется по условию
  useEffect(()=>{

    get_audio_steam()
    get_video_steam()

    set_ref()

    socket.on('connect',()=>{
  
      socket.on("disconnect", ()=>{
      })
  
    });

    socket.onAny(async(msg_type:string, msg?:MSG, sig?:ECallState, pack?:ArrayBuffer, audioOptions?:AudioOptions)=>{
      if (msg)
      {

        switch (msg.type)
        {
          case EMsgType.Room:
          {
            const mess = await getMessageForId(msg.msg_id);
            if (typeof mess != 'number')
              chatMessage[1](prevArray=>([...prevArray, mess]))
            
            if (alert_ref.current)
              alert_ref.current.src = "/sounds/msg_alert.mp3";
            
            break;
          }
          case EMsgType.Answer:
          {
            const mess = await getMessageForId(msg.msg_id);
            if (typeof mess != 'number')
              chatMessage[1](prevArray=>([...prevArray, mess]))
            break;
          }
        }
      }
      else if (sig)
      {
        switch (sig)
        {
          case ECallState.Alert:
            if (alert_ref.current)
              alert_ref.current.src = "/sounds/usr_con.mp3";
            const roomId = Number(msg_type.split("-")[2]);
            sig_to_room(socket, roomId, ECallState.Answer);
            break;

          case ECallState.Talk:
            if (audioOptions)
            {
              console.log(audioOptions)
              audio_options.mimeType = audioOptions.mimeType
              audio_options.audioBitsPerSecond = audioOptions.audioBitsPerSecond
              // set_audio_options(audioOptions);
              console.log(audio_options)
              talk_loop(Number(msg_type.split("-")[2]));
            }
            
            break;

          case ECallState.Release:
            if (alert_ref.current)
              alert_ref.current.src = "/sounds/usr_discon.mp3";
            break;
        }   
      }
      else if (pack)
      {
        if (audio_ref.current)
        {
          if (audio_options)
          {
            //.addSourceBuffer(audio_options.mimeType);
            // console.log(mediaSource)
            // if (mediaSource.readyState == "open")
            // {
            //   sourceBuffer = mediaSource.addSourceBuffer(audio_options.mimeType);
            //   sourceBuffer.appendBuffer(pack)
            // }
            const convert_pack = new Blob([pack], {type: audio_options.mimeType})
            console.log(pack)
            audio_ref.current.src = URL.createObjectURL(convert_pack)  
          }
          console.log(123)
        }
      }
    })
  },[setState])

  const get_audio_steam = async() => {
    try{
      voice_steam.current = await navigator.mediaDevices.getUserMedia({
        audio: true
      })

      // if (audio_ref.current)
      //   audio_ref.current.src = URL.createObjectURL(mediaSource);
        //   audio_ref.current.srcObject = voice_steam.current
    }
    catch(e)
    {
      console.log(e)
    }
  }

  const get_video_steam = async() => {
    try{
      video_steam.current = await navigator.mediaDevices.getUserMedia({
        video: true
      })
      if (video_ref.current)
        video_ref.current.srcObject = video_steam.current
    }
    catch(e)
    {
      console.log(e)
    }

  }

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
    // форма для создания чата
    const create_chat_fields:Field[] = [
          {name:"chat_name", type:"chat_name", value:create_chat_name, setVal:set_create_chat_name, onClick: ()=>{}},
          {name:"submit_button", type:"submit", value:create_chat_submite, setVal:set_create_chat_submite, onClick: undefined}
          ]

    // форма для отправки инвайта в чат
    const fields_invite_user:Field[] = [
          {name:"userId", type:"number", value:invite_usr_id, numSetVal:set_invite_usr_id, onClick: ()=>{}},
          {name:"submit_button", type:"submit", value:invite_usr_submite, setVal:set_invite_usr_submite, onClick: undefined}
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

    const invite_in_chat = (e:FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!invite_usr_id)
      {
        alert("Некоретные данные")
        return
      }
      const sendObj:InviteUser = {
          id: chatId[0],
          userId: invite_usr_id,
      }
      const proto = process.env.REACT_APP_API_PROTO || "http";
      const host = process.env.REACT_APP_API_HOST || "localhost";
      const port = process.env.REACT_APP_API_PORT || "2000";
      try{
        axios.post(`${proto}://${host}:${port}/chat/add`, sendObj, {withCredentials:true})
      }
      catch(e)
      {
          alert("Ошибка отправки приглошения чата")
      }
    }

    const set_ref = () => {
      if (create_chat_modal_ref.current){
        dialog_ref_array.current.push(create_chat_modal_ref.current);
      }
      if (invite_in_chat_modal_ref.current){
      dialog_ref_array.current.push(invite_in_chat_modal_ref.current);
      }
    }
  
    const remove_tmp_url = (e:React.SyntheticEvent<HTMLAudioElement, Event>) => {
      URL.revokeObjectURL(e.currentTarget.src)
    }

  return (
    <div>
      {
        Cookie.get('user') ? (
        <div >

        <audio
          autoPlay
          ref={alert_ref}>
        </audio>

        <video
          ref={video_ref}
          autoPlay
          muted>
        </video>

        <audio
          autoPlay
          ref={audio_ref}>
        </audio>
          <Dialog classname='create_chat' ref={create_chat_modal_ref}>
            <div>
              <Form name="chat" width={500} height={100} fields={create_chat_fields} submit={create_chat}/>
            </div>
          </Dialog>
          <div className='left_right_panel' ref={left_right_panel_ref}>
            <LeftPanel createChat={createChat} createChatEvent={createChatEvent} 
              createMessage={createMessage} createMessageEvent={createMessageEvent} switchAll={switchAllCreate}
              chatId={chatId} chatMessage={chatMessage} chatInfo={chatInfo} socket={socket}
              panel_ref={left_panel_ref} hiden_func={hide} dialog_ref_array={dialog_ref_array}/>

            <Dialog classname='invite_in_chat' ref={invite_in_chat_modal_ref}>
              <div>
                <Form name="invite" width={500} height={100} fields={fields_invite_user} submit={invite_in_chat}/>
              </div>
            </Dialog>
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
