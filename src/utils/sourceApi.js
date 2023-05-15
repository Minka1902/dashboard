class sourceApi {
    constructor() {
        this._source = 'http://localhost:4000';
    }

    _fetch = ({ method = "GET", url, data }) =>
        fetch(`${this._source}${url}`, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }).then(this._handleResponse)

    _handleResponse = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));

    initialize = () => this._fetch({ method: 'GET', url: '/get/all' });

    getSourceInfo = (name) => this._fetch({ method: 'GET', url: `/get/${name}` });

    createSource = (newSource) => this._fetch({ method: 'POST', url: '/add-source', data: newSource });

    updateSource = (name, newData) => this._fetch({ method: 'PUT', data: newData, url: `/update/${name}` });

    deleteSource = (name) => this._fetch({ method: 'DELETE', url: `/remove-source/${name}` })
}

const sourceApiOBJ = new sourceApi();
export default sourceApiOBJ;
