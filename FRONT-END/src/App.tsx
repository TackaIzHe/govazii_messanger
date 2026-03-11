import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Register from "./components/Register";
import Login from "./components/Login";
import React, { useState } from 'react';
import Cookie from 'js-cookie'
import { MessageProps } from './components/ListMessage';

export interface AppProps{
  createChat: [number, React.Dispatch<React.SetStateAction<number>>]
  createChatEvent: [number, React.Dispatch<React.SetStateAction<number>>]
  createMessage: [number, React.Dispatch<React.SetStateAction<number>>]
  createMessageEvent: [number, React.Dispatch<React.SetStateAction<number>>]
  chatId: [number, React.Dispatch<React.SetStateAction<number>>]
  chatMessage: [MessageProps[], React.Dispatch<React.SetStateAction<MessageProps[]>>]
  switchAll:Function
}

function App() {
  const [state, setState] = useState(0);
  const createChat = useState(0);
  const createChatEvent = useState(0);
  const createMessage = useState(0);
  const createMessageEvent = useState(0);
  const chatId = useState(0);
  const chatMessage = useState<MessageProps[]>([]);

  const switchState = () => {
    setState(state == 0 ? 1 : 0)
  }

  const switchAllCreate = (setState: [number, React.Dispatch<React.SetStateAction<number>>]) => {
    createChat[1](0);
    createMessage[1](0);

    setState[1](1)
  }

  return (
    <div>
      {
        Cookie.get('user') || state > 1 ? (
        <div className='left_right_panel'>
            <LeftPanel createChat={createChat} createChatEvent={createChatEvent} 
            createMessage={createMessage} createMessageEvent={createMessageEvent} switchAll={switchAllCreate}
            chatId={chatId} chatMessage={chatMessage}/>
            <RightPanel createChat={createChat} createChatEvent={createChatEvent}
            createMessage={createMessage} createMessageEvent={createMessageEvent} switchAll={switchAllCreate}
            chatId={chatId} chatMessage={chatMessage}/>
          </div>
        ):
        state == 0 ?(
          <div>
            <Register/>
            <button onClick={switchState}>Go to Login</button>
          </div>
        ):(
          <div>
            <Login switchState={setState}/>
            <button onClick={switchState}>Go to Register</button>
          </div>
        )
      }
    </div>
  );
}

export default App;
