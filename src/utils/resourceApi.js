class resourceApi {
    constructor() {
        this._resource = '';
    }

    _fetch = ({ method = "GET", resourceUrl = this._resource }) =>
        fetch(`${resourceUrl}`, {
            method
        }).then(this._handleResponseJson)

    _handleResponseJson = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));

    _handleResponseText = (res) => (res.ok ? res.text() : console.log("Error"));

    _handleError = (err) => Promise.reject(err);

    refresh = (url) => this._fetch({ method: "GET", resourceUrl: url });
}

const resourceApiOBJ = new resourceApi();
export default resourceApiOBJ;
