import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

//to handle when the Google maps API fails to fetch
window.gm_authFailure = function() {
    
   alert('Google maps failed to load! please try again later');
}
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
