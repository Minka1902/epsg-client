class osmApi {
  constructor() {
    this._coord = [];
  }

  _fetch = ({ method = "GET", data = this._coord }) =>
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${data[0]}&lon=${data[1]}&format=json`, {
      method
    }).then(this._handleResponse)

  _handleResponse = (res) => (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));

  _handleTopoResponse = (res) => (res.ok ? res.text() : console.log("Error"));

  _handleError = (err) => Promise.reject(err);

  searchNewCoordinates = (coord) => this._fetch({ method: "GET", data: coord });

  topo = () =>
    fetch("http://topo.geomage.com?epsg_code=29191&start_x=336000&end_x=354000&start_y=9684000&end_y=9702000&step=90", {
      method: "GET",
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      }
    })
      .then(this._handleTopoResponse)

  other = ({ method, data }) => this._fetch({ method, data });
}

const osmApiOBJ = new osmApi();
export default osmApiOBJ;

