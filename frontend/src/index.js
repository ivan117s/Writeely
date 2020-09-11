import React from 'react';
import ReactDOM from 'react-dom';
import "regenerator-runtime/runtime.js";

import * as serviceWorker from './serviceWorker';

//redux
import {Provider} from 'react-redux';
import store from './redux/index'; 

//scss
import './Scss/index.scss'; 
import 'react-image-crop/lib/ReactCrop.scss';

//components
import App from './App';

const root = document.getElementById('react-root');
root.draggable = false;



if (root.hasChildNodes()) {
  ReactDOM.hydrate( 
  <Provider store={store}>
    <App/>
  </Provider>, root);
} 
else 
{
  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>
  , root);
}


serviceWorker.unregister();
