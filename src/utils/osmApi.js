class osmApi {
  constructor() {
    this._coord = [];
  }

  _fetch = ({ method = "GET", data = this._coord }) =>
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${data[0]}&lon=${data[1]}&format=json`, {
      method
    }).then(this._handleResponseJson)

  _bbox = ({ method = "GET", data }) =>
    fetch(`https://nominatim.openstreetmap.org/search?format=json&viewbox=${data[0]},${data[1]},${data[2]},${data[3]}}&bounded=1`, {
      method
    }).then(this._handleResponseJson)


  _handleResponseJson = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));

  _handleResponseText = (res) => (res.ok ? res.text() : console.log("Error"));

  _handleError = (err) => Promise.reject(err);

  searchNewCoordinates = (coord) => this._fetch({ method: "GET", data: coord });

  boundingBox = (bbox) => this._bbox({ data: bbox });
}

const osmApiOBJ = new osmApi();
export default osmApiOBJ;
