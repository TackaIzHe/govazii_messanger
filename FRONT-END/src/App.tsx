import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import Register from "./components/Register";
import Login from "./components/Login";
import { useState } from 'react';
import Cookie from 'js-cookie'

function App() {
  const [state, setState] = useState(0);
  const [createChat, setCreateChat] = useState(0);
  const [createChatEvent, setCreateChatEvent] = useState(0);

  const switchState = () => {
    setState(state == 0 ? 1 : 0)
  }

  return (
    <div>
      {
        Cookie.get('user') || state > 1 ? (
        <div className='left_right_panel'>
            <LeftPanel createChat={createChat} createChatState={setCreateChat} 
            createChatEvent={createChatEvent} createChatEventState={setCreateChatEvent}/>
            <RightPanel createChat={createChat} createChatState={setCreateChat}
            createChatEvent={createChatEvent} createChatEventState={setCreateChatEvent}/>
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
