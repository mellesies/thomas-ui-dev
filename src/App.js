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
            network: null,
        }
    }


    /**
     * Triggered when dropdown list in Header changes.
     */
    onNetworkSelected = (network_id) => {
        console.log(`network ${network_id} selected!`);
        this.setNetwork(network_id);
    }

    /**
     * Update state.
     *
     * TODO:
     *   - use URL for network_id state
     *   - move logic for retrieving network details to Network
     */
    setNetwork(network_id) {
        network_id = parseInt(network_id);

        var network;

        for (var i=0; i < this.state.networks.length; i++) {
            if (this.state.networks[i].id === network_id) {
                network = this.state.networks[i].json;

                // FIXME: This feels like a hack.
                network.id = network_id;
                break;
            }
        }

        this.setState({
            network_id,
            network,
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
            if (networks.length > 0) {
                this.setState(
                    { networks },
                    () => this.setNetwork(networks[0].id)
                );
            }
        });
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
