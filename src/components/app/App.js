import React from 'react';
import proj4 from 'proj4';
import osmApiOBJ from '../../utils/osmApi';
import Map from '../map/Map';
import LatLonForm from '../form/LatLonForm';
import Table from '../table/table';

export default function App() {
  const [coords, setCoords] = React.useState([35.9308, 14.3845]);
  const [address, setAddress] = React.useState('');
  const [epsgCoords, setEpsgCoords] = React.useState([]);
  const [fromEpsg, setFromEpsg] = React.useState('');
  const [epsgTable, setEpsgTable] = React.useState([])
  const epsg = require('epsg')

  const epsgConvert = (fromEpsg, x, y, isPoint0) => {
    let fromProj = epsg[`EPSG:${fromEpsg}`];
    let toProj = epsg[`EPSG:4326`];
    let coordinates;
    if (isPoint0) {
      coordinates = proj4(fromProj, toProj, [y, x]);
      return { y: coordinates[0], x: coordinates[1] };
    } else {
      setEpsgCoords([x, y]);
      setFromEpsg(fromEpsg);
      if (toProj && fromProj) {
        if (toProj === fromProj) {
          coordinates = proj4(fromProj, [y, x]);
          onCoordinateSubmit({ y: coordinates[1], x: coordinates[0], is4326: true })
        } else {
          coordinates = proj4(fromProj, toProj, [y, x]);
          onCoordinateSubmit({ y: coordinates[1], x: coordinates[0] })
        }
      } else {
        console.log("Error! EPSG CODE NON-EXISTING!")
      }
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

  const arrayByDistance = (arr) => {
    arr.sort((a, b) => a.distance - b.distance);
    return arr;
  }

  // ! Extaracts starting point from projection.
  const getX0Y0 = (proj) => {
    const x0start = proj.indexOf(`+x_0=`) + 5;
    const x0end = proj.indexOf(` +`, x0start);
    const y0start = proj.indexOf(`+y_0=`) + 5;
    const y0end = proj.indexOf(` +`, y0start);
    let xCoord = '', yCoord = '';
    if (x0start !== y0start) {

      for (let i = 0; i < (x0end - x0start); i++) {
        xCoord += proj[x0start + i];
      }

      for (let i = 0; i < (y0end - y0start); i++) {
        yCoord += proj[y0start + i];
      }

      return { y0: parseFloat(yCoord), x0: parseFloat(xCoord) };
    }
  }

  // ! Calculates distance between 2 locations(lat, lng)
  const calcDistance = ({ lat1, lon1, lat2, lon2 }) => {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const latitude1 = toRad(lat1);
    const latitude2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latitude1) * Math.cos(latitude2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return `${d}`;
  }

  // ! Creates the 0 point for the object
  const createPoint0 = (fromEpsg) => {
    let fromProj = epsg[`EPSG:${fromEpsg}`];
    const xy = getX0Y0(fromProj);
    if (xy) {
      return epsgConvert(fromEpsg, xy.x0, xy.y0, true);
    }
    return { y: undefined, x: undefined }
  }

  // ! Converts numeric degrees to radians
  const toRad = (value) => {
    return value * Math.PI / 180;
  }

  const findEpsgCodes = ({ coords }) => {
    let coordinates;
    let arr = [];
    let newEpsgObj = {};
    for (let i = 0; i < 30000; i++) {
      newEpsgObj.epsg = `EPSG:${2000 + i}`;
      const fromProj = epsg[`EPSG:${2000 + i}`];
      const toProj = epsg[`EPSG:4326`];
      if (toProj && fromProj) {
        newEpsgObj.epsgPoint0 = createPoint0(2000 + i);
        if (toProj === fromProj) {
          coordinates = proj4(fromProj, [coords.latitude, coords.longtitude]);
          newEpsgObj.corespondingLocation = { latitude: coordinates[0].toFixed(5), longtitude: coordinates[1].toFixed(5) };
        } else {
          if (newEpsgObj.epsgPoint0.x && newEpsgObj.epsgPoint0.y) {
            coordinates = proj4(fromProj, toProj, [coords.latitude, coords.longtitude]);
            newEpsgObj.corespondingLocation = { latitude: coordinates[0].toFixed(5), longtitude: coordinates[1].toFixed(5) };
          }
        }
        newEpsgObj.distance = calcDistance({
          lat1: newEpsgObj.epsgPoint0.y,
          lon1: newEpsgObj.epsgPoint0.x,
          lat2: coords.latitude,
          lon2: coords.longtitude
        });
        arr[i] = Object.assign({}, newEpsgObj);
        newEpsgObj = {};
      } else {
        console.log(`Error! EPSG CODE ${2000 + i} NON-EXISTING!`)
      }
    }
    arrayByDistance(arr);
    setEpsgTable([arr[0], arr[1], arr[2], arr[3], arr[4]]);
  }

  return (
    <div id='content'>
      <Map coords={coords}
        address={address}
      />
      <div className='app__conteiner'>
        <LatLonForm onEpsgSubmit={findEpsgCodes}
          onCoordinatesSubmit={epsgConvert}
        />
        <h3 className='app__coordinates'>Lat/Lng coordinates: <br />{coords[0].toFixed(5)}, {coords[1].toFixed(5)}</h3>
        {epsgCoords[1] ? <h3 className='app__coordinates'>coordinates to EPSG:{fromEpsg}: <br />{epsgCoords[0]}, {epsgCoords[1]}</h3> : <></>}
        <h4 className='app__location-info'>Location info: <br />{address}</h4>
        {epsgTable[4] ? <Table data={epsgTable} tableHeaders={['Rank', 'Possible EPSG', 'Distance (km)']} /> : <></>}
      </div>
    </div>
  );
}


