import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


import './index.css';

import App from './App';
import { api } from '_api';
import { api_config } from 'config.js';

import * as serviceWorker from './serviceWorker';

// console.log('api_config:', api_config);
// console.log(config.api_url);
api.init(api_config);

ReactDOM.render(
    <Router>
        <Switch>
            <Route
                path="/"
                component={App}
                />
        </Switch>
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
