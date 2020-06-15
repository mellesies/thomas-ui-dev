
// API
const api_config = {};

if (process.env.NODE_ENV === 'development') {
    console.log('Running in development mode')
    api_config['baseURL'] = 'http://localhost:5000';

} else {
    // console.log('Running in production mode')
    api_config['baseURL'] = '';
}

// Environment variable always overrides
if (process.env.REACT_APP_BASEURL) {
    // console.log('Overriding "api_config.baseURL" with value from environment!');
    api_config['baseURL'] = process.env.REACT_APP_BASEURL;
}

// console.log('api_config:', api_config);
export { api_config };

// LOCALE
export const locale_config = {
    language: '',
    locale: '',
}
