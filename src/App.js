import React, { Component } from 'react';
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// import Header from 'header';
import About from 'about';
import Footer from 'footer';
import Main from 'main';

import './App.scss';


export default class App extends Component {

    render() {
        return (
            <div className="App">
                <Switch>
                    <Route path="/about">
                        <About />
                    </Route>

                    <Route
                        path={["/network/:network_id", "/network"]}
                        component={Main}
                        />

                    <Route exact path="/">
                        <Redirect to="/network" />
                    </Route>
                </Switch>

                <Footer />
            </div>
        );
    }
}
