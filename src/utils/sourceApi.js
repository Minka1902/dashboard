import { PUBLIC_BASE_URL, PRIVATE_BASE_URL } from "./auth";

class sourceApi {
    constructor() {
        this._publicUrl = PUBLIC_BASE_URL;
        this._privateUrl = PRIVATE_BASE_URL;
    }

    _fetch = ({ method = "GET", url, data, isPrivate = false }) =>
        fetch(`${isPrivate ? this._privateUrl : this._publicUrl}${url}`, {
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

    updateSource = (name, newData) => this._fetch({ method: 'PUT', data: newData, url: `/update/${name}` })

    deleteSource = (name) => this._fetch({ method: 'DELETE', url: `/remove-source/${name}` })

    checkSource = (url) => this._fetch({ method: 'GET', url: `/check-source/${url}`, isPrivate: true })

    editSource = (name, newData) => this._fetch({ method: 'PUT', data: newData, url: `/edit/${name}` })
}

const sourceApiOBJ = new sourceApi();
export default sourceApiOBJ;
