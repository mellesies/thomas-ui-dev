import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './stylesheet.scss';

export default class Header extends Component {

    onChange = (event) => {
        // console.log("Header::onChange(): ", event.target.value);
        const network_id = event.target.value;
        this.props.onNetworkSelected(network_id);
    }

    renderOptions() {
        return this.props.networks.map(n =>
            <option key={n.id} value={n.id}>
                {n.name}
            </option>
        );
    }

    render() {
        const { network_id } = this.props;

        return (
            <div className="Header">
                <div className="top">
                    <div className="left">
                        <span className="h1">
                            <Link to="/" className="main">Thomas</Link>
                        </span>
                        &nbsp; A Bayesian Network viewer.
                    </div>

                    <div className="right">
                        <a
                            href="https://github.com/mellesies/thomas-master"
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            Github
                        </a>
                    </div>
                </div>

                <select onChange={this.onChange} value={network_id || ''}>
                    <option disabled value=''> -- select Bayesian network -- </option>
                    { this.renderOptions() }
                </select>
            </div>
        );
    }
}