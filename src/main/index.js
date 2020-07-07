import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Header from 'header';
import Network from 'network';


import { api } from '_api';

import './stylesheet.scss';


export default class Main extends Component {

    constructor(props) {
        super(props);

        this.state = {
            networks: [],
        }
    }

    componentWillUnmount() {
        // Stop listening for route changes.
        this.unlisten();
    }

    componentDidMount() {
        // Retrieve a list of BN's from the server.
        api.getNetworks().then(networks => {
            // console.log('App.componentDidMount(): ', networks);
            if (networks.length > 0) {
                this.setState({ networks });
            }
        });

        // Listen for backbutton clicks
        this.unlisten = this.props.history.listen((location, action) => {
            console.log("on route change");
        });
    }

    /**
     * Triggered when dropdown list in Header changes.
     */
    onNetworkSelected = (network_id) => {
        // Update the URL query parameters
        this.props.history.push({
            pathname: `/network/${network_id}`,
            search: ''
        })
    }

    render() {
        var { networks } = this.state;
        const { network_id } = this.props.match.params;

        return (
            <div className="Main">
                <Header
                    networks={networks}
                    network_id={network_id}
                    onNetworkSelected={this.onNetworkSelected}
                    {...this.props}
                    />

                {
                    network_id &&
                        <Network
                            key={network_id}
                            network_id={network_id}
                            {...this.props}
                            />
                }

                {
                    !network_id &&
                        <div className="centered">
                            <div><h2>Select a Bayesian network to continue:</h2></div>
                            <div>
                                {networks.map(n =>
                                        <Link
                                            key={n.id}
                                            to={"/network/" + n.id}
                                            className="block"
                                            >
                                            {n.name}
                                        </Link>
                                )}
                            </div>
                        </div>
                }
            </div>
        )
    }
}
