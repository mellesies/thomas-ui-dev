import axios from 'axios';


class Api {
    constructor() {
        this._axios = null;
    }

    /**
     * Initialize the API.
     */
    init(config) {
        // Setup axios to use JWT and automatically refresh if necessary.
        this._axios = axios.create(config);
    }

    request(config) {
        // console.log('Api::request()', config);
        return this._axios.request(config).then(r => r.data);
    }

    /**
     * Return the API version
     */
    getVersion() {
        return this.request({
            url: '/version',
            method: 'GET',
        });
    }

    getNetworks() {
        // console.log('Api::getNetworks()');

        return this.request({
            url: '/network',
            method: 'GET',
        });
    }

    getNetwork(id) {
        return this.request({
            url: `/network/${id}`,
            method: 'GET',
        });
    }

    saveNetwork(id, network) {
        return this.request({
            url: `/network/${id}`,
            method: 'POST',
            data: network,
        });
    }

    queryNetwork(id, parameters) {

        return this.request({
            url: `/network/${id}/_query`,
            params: parameters,
            method: 'GET',
        })
    }
}

export const api = new Api();
export default api;