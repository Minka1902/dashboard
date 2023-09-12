import { PUBLIC_URL } from "./auth";

class collectionApi {
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

    createCollection = (name) => this._fetch({ method: 'POST', url: `/create-collection`, data: name })

    getEntries = (name) => this._fetch({ method: 'GET', url: `/collection/${name}` })

    getLastEntry = (name) => this._fetch({ method: 'GET', url: `/collection/last/${name}`, })

    deleteCollection = (name) => this._fetch({ method: "DELETE", url: `/collections/remove/${name}` })
}

const collectionApiObj = new collectionApi();
export default collectionApiObj;
