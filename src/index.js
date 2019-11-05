import React from 'react';
import ReactDOM from 'react-dom';
import Root from './client/Root';
import * as serviceWorker from './serviceWorker';
import store from "./store";
import 'bootstrap/dist/css/bootstrap.css'

var module = store();

ReactDOM.render(
    <Root store={module.store} persistor={module.persistor} />,
    document.getElementById("root")
);

serviceWorker.unregister();
