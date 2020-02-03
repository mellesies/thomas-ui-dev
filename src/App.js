import React, { Component } from 'react';

import Header from 'header';
import Footer from 'footer';
import Network from 'network';
import { api } from '_api';

import './App.css';



// <Stage width={window.innerWidth} height={window.innerHeight}>
export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            networks: [],
            network: null,
        }
    }

    onNetworkSelected = (id) => {
        console.log(`network ${id} selected!`);
        this.setNetwork(id);
    }

    setNetwork(id) {
        // console.log(`App::setNetwork(${id})`);
        id = parseInt(id);

        var network;
        const network_id = id;

        for (var i=0; i < this.state.networks.length; i++) {
            if (this.state.networks[i].id === id) {
                network = this.state.networks[i].json;
                // FIXME: This feels like a hack ...
                network.id = id;
                break;
            }
        }

        this.setState({
            network_id,
            network,
        })
    }

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
