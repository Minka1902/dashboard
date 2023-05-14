class sourceApi {
    constructor() {
        this._source = 'http://localhost:4000';
    }

    _fetch = ({ method = "GET", url, data }) =>
        fetch(`${this._source}/${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(data),
        }).then(this._handleResponseJson)

    _fetchNoBody = ({ method = "GET", path = this._path }) =>
        fetch(`${this._rootUrl}${path}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
            },
        }).then(this._handleResponse)

    _handleResponseJson = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));

    initialize = () => this._fetchNoBody({ method: 'GET', url: '/get/all' });

    getSourceInfo = (name) => this._fetchNoBody({ method: 'GET', url: `/get/${name}` });

    createSource = (newSource) => this._fetch({ method: 'POST', url: '/add-source', data: newSource });

    updateSource = (name, newData) => this._fetch({ method: 'PUT', data: newData, url: `/update/${name}` });

    deleteSource = (name) => this._fetch({ method: 'DELETE', url: `/remove-source/${name}` })
}

const sourceApiOBJ = new sourceApi();
export default sourceApiOBJ;
