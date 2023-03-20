class osmApi {
  constructor() {
    this._coord = [];
  }

  _fetch = ({ method = "GET", data = this._coord }) =>
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${data[0]}&lon=${data[1]}&format=json`, {
      method
    }).then(this._handleResponse)

  _handleResponse = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));

  _handleTopoGeomageResponse = (res) => (res.ok ? res.text() : console.log("Error"));

  _handleError = (err) => Promise.reject(err);

  searchNewCoordinates = (coord) => this._fetch({ method: "GET", data: coord });

  topoGeomage = ({epsg, coords, step}) =>
    fetch(`http://topo.geomage.com?epsg_code=${epsg}&start_x=${coords[0]}&end_x=${coords[1]}&start_y=${coords[2]}&end_y=${coords[3]}&step=${step}`, {
      method: "GET",
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      }
    })
      .then(this._handleTopoResponse)

  topo = (query) =>
    fetch(`https://lz4.overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`, {
      method: "GET",
    })
      .then(this._handleResponse)

  other = ({ method, data }) => this._fetch({ method, data });
}

const osmApiOBJ = new osmApi();
export default osmApiOBJ;

