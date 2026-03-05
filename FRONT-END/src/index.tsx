import ReactDOM from 'react-dom/client';
import App from './App';

const body = ReactDOM.createRoot(
  document.getElementById('body') as HTMLElement
);

body.render(
  <App/>
);