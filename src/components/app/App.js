import React from 'react';
import osmApiOBJ from '../../utils/osmApi';
import Map from '../map/Map';
import LatLonForm from '../form/LatLonForm';
import proj4 from 'proj4';

export default function App() {
  const [coords, setCoords] = React.useState([35.9308, 14.3845]);
  const [address, setAddress] = React.useState('');
  const [epsgCoords, setEpsgCoords] = React.useState([]);
  const [fromEpsg, setFromEpsg] = React.useState('');

  const epsg = require('epsg')

  const epsgConvert = (fromEpsg, x, y) => {
    setEpsgCoords([x, y]);
    setFromEpsg(fromEpsg);
    let fromProj = epsg[`EPSG:${fromEpsg}`];
    let toProj = epsg[`EPSG:4326`];
    let coordinates;
    if (toProj && fromProj) {
      if (toProj === fromProj) {
        coordinates = proj4(fromProj, [y, x]);
        onCoordinateSubmit({ y: coordinates[1], x: coordinates[0], is4326: true })
      } else {
        coordinates = proj4(fromProj, toProj, [y, x]);
        onCoordinateSubmit({ y: coordinates[1], x: coordinates[0] })
      }
      // setNewCoords([x, y]);
    } else {
      console.log("Error! EPSG CODE NON-EXISTING!")
    }
  }

  const onCoordinateSubmit = ({ x, y, is4326 = false }) => {
    osmApiOBJ.searchNewCoordinates(is4326 ? [x, y] : [y, x])
      .then((data) => {
        if (data) {
          setCoords([Number.parseFloat(data.lat), Number.parseFloat(data.lon)]);
          setAddress(data.display_name);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(`Coordinate search error: ${err}`);
        }
      });
  }

  React.useEffect(() => {
    onCoordinateSubmit({ x: 35.02364, y: 31.91688 });   // eslint-disable-next-line
  }, []);

  return (
    <div id='content'>
      <Map coords={coords}
        address={address}
      />
      <div className='app__conteiner'>
        <LatLonForm onSubmit={epsgConvert} />
        <h3 className='app__coordinates'>Lan/Lng coordinates: <br />{coords[0].toFixed(5)}, {coords[1].toFixed(5)}</h3>
        {epsgCoords[1] ? <h3 className='app__coordinates'>coordinates to EPSG:{fromEpsg}: <br />{epsgCoords[0]}, {epsgCoords[1]}</h3> : <></>}
        <h4 className='app__location-info'>Location info: <br />{address}</h4>
      </div>
    </div>
  );
}
