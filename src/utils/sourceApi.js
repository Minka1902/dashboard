import { PUBLIC_URL } from "./auth";

class sourceApi {
    constructor() {
        this._publicUrl = PUBLIC_URL;
    }

    _fetch = ({ method = "GET", url, data }) =>
        fetch(`${this._publicUrl}${url}`, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }).then(this._handleResponse)

    _handleResponse = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`))

    init = () => this._fetch({ method: 'GET', url: '/get/all' })

    getSourceInfo = (id) => this._fetch({ method: 'GET', url: `/get/${id}` })

    createSource = (newSource) => this._fetch({ method: 'POST', url: '/add-source', data: newSource })

    deleteSource = (id) => this._fetch({ method: 'DELETE', url: `/remove-source/${id}` })

    editSource = (name, newData) => this._fetch({ method: 'PUT', data: newData, url: `/edit/${name}` })
}

const sourceApiOBJ = new sourceApi();
export default sourceApiOBJ;
