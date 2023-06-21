import { PUBLIC_BASE_URL } from "./auth";

class updateApi {
    constructor() {
        this._url = PUBLIC_BASE_URL;
    }

    _fetch = ({ method = "GET", resourceUrl }) =>
        fetch(`${this._url}/${resourceUrl}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        }).then(this._handleResponse)

    _handleResponse = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));

    _handleError = (err) => Promise.reject(err);

    getAllUpdates = () => this._fetch({ method: "GET", resourceUrl: 'get-all' });

    deleteUpdate = (id) => this._fetch({ method: "DELETE", resourceUrl: `delete-update/${id}` });
}

const updateApiOBJ = new updateApi();
export default updateApiOBJ;
