class urlApi {
    constructor() {
        this._path = '/url';
        this._rootUrl = window.origin;
    }

    _fetch = ({ method = "GET", data = null, path = this._path }) =>
        fetch(`${this._rootUrl}${path}`, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
            },
        }).then(this._handleResponse)

    _fetchNoBody = ({ method = "GET", path = this._path }) =>
        fetch(`${this._rootUrl}${path}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
            },
        }).then(this._handleResponse)

    _handleResponse = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));

    _handleError = (err) => Promise.reject(err);

    createUrl = (url, name, bbox) => this._fetch({ method: "POST", data: { url: url, name: name, coordinates: bbox }, path: '/url' });

    deleteUrl = (id) => this._fetch({ method: "DELETE", path: `/url/${id}` });

    getUrl = (id) => this._fetchNoBody({ method: 'GET', path: `/url/${id}` });

    getByName = (name) => this._fetchNoBody({ method: 'GET', path: `/find/${name}` });
}

const urlApiOBJ = new urlApi();
export default urlApiOBJ;
