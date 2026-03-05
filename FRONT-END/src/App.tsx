import ENV from "dotenv"
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

function App() {
  return (
    <div className='left_right_panel'>
      <LeftPanel/>
      <RightPanel/>
    </div>
  );
}

export default App;
