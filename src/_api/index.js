import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

const getAccessToken = () => {
    return localStorage.getItem('access_token');
}

const setAccessToken = (token) => {
    localStorage.setItem('access_token', token);
}


class Api {
    constructor() {
        this._axios = null;
        this._user = false; }

    /**
     * Initialize the API.
     */
    init(config) {
        // Setup axios to use JWT and automatically refresh if necessary.
        this._config = config;
        this._axios = axios.create(config);

        this._axios.interceptors.request.use(request => {
            request.headers['Authorization'] = 'Bearer ' + getAccessToken();
            return request;
        });

        createAuthRefreshInterceptor(
            this._axios,
            (failedRequest) => this.refreshAuthLogic(failedRequest)
        );

        // Make axios.request available for flexibility
        this.request = this._axios.request;
    }

    // Function that will be called to refresh authorization
    refreshAuthLogic(failedRequest) {
        axios.create(this._conifg).post('/token/refresh')
        .then(tokenRefreshResponse => {
            const { access_token } = tokenRefreshResponse.data;
            setAccessToken(access_token);

            const { headers } = failedRequest.response.config;
            headers['Authorization'] = `Bearer ${access_token}`;

            return Promise.resolve();
        })
    }

    _request(config) {
        console.log('Api::request()', config);
        return this._axios.request(config).then(r => r.data);
    }

    /**
     * Return the API version
     */
    getVersion() {
        return this._request({
            url: '/version',
            method: 'GET',
        });
    }

    getNetworks() {
        console.log('Api::getNetworks()', );

        return this._request({
            url: '/network',
            method: 'GET',
        });
    }

    getNetwork(id) {
        return this._request({
            url: `/network/${id}`,
            method: 'GET',
        });
    }

    saveNetwork(id, network) {
        return this._request({
            url: `/network/${id}`,
            method: 'POST',
            data: network,
        });
    }

    queryNetwork(id, parameters) {
        var query = {
            id: id,
            query: {
                ...parameters
            }
        };

        return this._request({
            url: `/network/_query`,
            // params: parameters,
            data: query,
            method: 'POST',
        })
    }
}

export const api = new Api();
export default api;