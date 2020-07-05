import React, { Component } from 'react';

import Header from 'header';
import Footer from 'footer';
import Network from 'network';
import { api } from '_api';

import './App.scss';


function Comment(props) {
    // console.log(props.children);
    return null;
}


export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            networks: [],
            network_id: null,
            network: null,
        }
    }

    /**
     * Triggered when dropdown list in Header changes.
     */
    onNetworkSelected = (network_id) => {
        console.log(`network ${network_id} selected!`);

        api.getNetwork(network_id).then((response) => {
            console.log('onNetworkSelected - ', response);

            var network = response.json;
            network.id = network_id;

            this.setState({
                network_id,
                network,
            })
        })
    }

    /**
     * Called once after the component is created and has been attached to the
     * DOM.
     *
     * Retrieves BNs from the server and updates state when complete.
     */
    componentDidMount() {
        api.getNetworks().then(networks => {
            console.log('App.componentDidMount(): ', networks);

            if (networks.length > 0) {
                this.setState(
                    { networks },
                    () => this.onNetworkSelected(networks[0].id)
                );
            }
        });

        api.getSession().then(response => {
            console.log(' -- getSession:', response)
        })
    }

    render() {
        var {
            networks,
            network_id,
            network
        } = this.state;

        // console.log('App::render(): ', network);

        return (
            <div className="App">
                <Comment>Header that displays </Comment>

                <Header
                    networks={networks}
                    onNetworkSelected={this.onNetworkSelected}
                    />
                { network === null &&
                    <span>Loading ...</span>
                }

                {
                    /*
                        'key' is provided to force React to recreate the component
                        when props change. See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component
                    */
                    network &&
                        <Network
                            key={network.id}
                            network_id={network_id}
                            network={network}
                            />
                }
                <Footer />
            </div>
        );
    }
}

// export default App;
