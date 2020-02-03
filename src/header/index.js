import React, { Component } from 'react';

import './stylesheet.scss';

export default class Header extends Component {

    onChange = (event) => {
        // console.log("Header::onChange(): ", event.target.value);
        this.props.onNetworkSelected(event.target.value);
    }

    renderOptions() {
        return this.props.networks.map(n =>
            <option key={n.id} value={n.id}>
                {n.name}
            </option>
        );
    }

    render() {
        return (
            <div className="Header">
                <select onChange={this.onChange}>
                    { this.renderOptions() }
                </select>
            </div>
        );
    }
}