import React from 'react';
import proj4 from 'proj4';
import osmApiOBJ from '../../utils/osmApi';
import Map from '../map/Map';
import LatLonForm from '../form/LatLonForm';
import Table from '../table/Table';
import ButtonBox from '../buttonBox/ButtonBox';
import Dropdown from '../dropdown/Dropdown';
import EpsgForm from '../form/EpsgForm'
import Pointer from '../../images/pointer.svg';

export default function App() {
  const [coords, setCoords] = React.useState([31.89291, 35.03254]);
  const [copyCoords, setCopyCoords] = React.useState(null);
  const [address, setAddress] = React.useState('');
  const [epsgCoords, setEpsgCoords] = React.useState([]);
  const [fromEpsg, setFromEpsg] = React.useState('');
  const [epsgTable, setEpsgTable] = React.useState([]);
  const [isClickable, setIsClickable] = React.useState(false);
  const [isView, setIsView] = React.useState(false);
  const [didCopy, setDidCopy] = React.useState(false);
  const [isPreloader, setIsPreloader] = React.useState(false);
  const [isPointer, setIsPointer] = React.useState(false);
  const epsg = require('epsg');
  // const [shouldRecenterMe, setShouldRecenterMe] = React.useState(false);
  // const [shouldRecenterMarker, setShouldRecenterMarker] = React.useState(false);
  // const [isClickedLocation, setIsClickedLocation] = React.useState(false);
  // const setShouldRecenterMeTrue = () => setShouldRecenterMe(true);

  const togglePointer = () => setIsPointer(!isPointer);

  const setViewTrue = () => setIsView(true);

  const setViewFalse = () => setIsView(false);

  const setIsClickableTrue = () => setIsClickable(true);

  const setDidCopyTrue = () => setDidCopy(true);

  const copyCoordsClick = (coords) => {
    setCopyCoords(coords);
    setDidCopy(false);
  }

  const clickLocation = ({ latitude, longtitude }) => {
    setIsClickable(false);
    findEpsgCodes({ coordins: { longtitude: longtitude, latitude: latitude } });
  }

  // ! converts location between different EPSG codes
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

  // ! get the info about the location found
  const onCoordinateSubmit = ({ x, y, is4326 = false }) => {
    osmApiOBJ.searchNewCoordinates(is4326 ? [x, y] : [y, x])
      .then((data) => {
        if (data) {
          setIsView(true);
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

  // ! Extaracts starting point from projection
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
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return (distance.toFixed(3)) / 2;
  }

  // ! Converts numeric degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
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

  // ! Creates a list of EPSG codes and renders the closest onces
  const findEpsgCodes = ({ coordins }) => {
    setIsPreloader(true);
    let coordinates;
    let arr = [];
    let newEpsgObj = {};
    for (let i = 26; i < 33000; i++) {
      newEpsgObj.epsg = `EPSG:${2000 + i}`;
      const fromProj = epsg[`EPSG:${2000 + i}`];
      const proj4326 = epsg[`EPSG:4326`];
      if (proj4326 && fromProj) {
        newEpsgObj.epsgPoint0 = createPoint0(2000 + i);
        if (proj4326 === fromProj) {
          coordinates = proj4(fromProj, [coordins.latitude, coordins.longtitude]);
          newEpsgObj.corespondingLocation = { latitude: coordinates[0].toFixed(5), longtitude: coordinates[1].toFixed(5) };
        } else {
          if (newEpsgObj.epsgPoint0.x && newEpsgObj.epsgPoint0.y) {
            if (newEpsgObj.epsgPoint0.x !== Infinity || newEpsgObj.epsgPoint0.y !== Infinity) {
              coordinates = proj4(fromProj, proj4326, [coordins.latitude, coordins.longtitude]);
              newEpsgObj.corespondingLocation = { latitude: coordinates[0].toFixed(5), longtitude: coordinates[1].toFixed(5) };
              newEpsgObj.distance = calcDistance({
                lat1: newEpsgObj.corespondingLocation.latitude,
                lon1: newEpsgObj.corespondingLocation.longtitude,
                lat2: coordins.latitude,
                lon2: coordins.longtitude
              });
            }
          }
        }
        addElementToArray(arr, newEpsgObj);
        newEpsgObj = {};
      }
    }
    arr.sort((a, b) => a.distance - b.distance);
    // createMarkerData([arr[0], arr[1], arr[2], arr[3], arr[4]]);
    setEpsgTable([arr[0], arr[1], arr[2], arr[3], arr[4]]);
    setIsPreloader(false);
  }

  // ! Checks if the element should be added to the array
  const addElementToArray = (arr, elem) => {
    let shouldEnter = true;
    if (elem.epsgPoint0 && elem.corespondingLocation) {
      if (elem.distance < 10000) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].distance === elem.distance) {
            shouldEnter = false;
            break;
          }
        }
        if (shouldEnter) {
          arr[arr.length] = Object.assign({}, elem);
        }
      }
    }
  }

  const createMarkerData = (arr) => {
    let tempArr = arr;
    for (let i = 0; i < tempArr.length; i++) {

    }
  }

  // ! sets the map for the first time
  React.useEffect(() => {
    onCoordinateSubmit({ x: 35.03254, y: 31.89291 });   // eslint-disable-next-line
  }, []);

  return (
    <div id='content'>
      <Map coords={coords}
        address={address}
        isClickable={isClickable}
        findEpsgClick={clickLocation}
        copyClicked={copyCoordsClick}
        didCopy={didCopy}
        isView={isView}
        setViewFalse={setViewFalse}
        markerData={epsgTable}>
        {isPointer ? <img src={Pointer} alt='Map pointer' className='app__map-pointer' /> : <></>}
      </Map>
      <div className='app__conteiner'>
        <ButtonBox isModi={copyCoords ? false : true}
          didCopy={didCopy}
          isPointer={isPointer}
          didEPSG={isClickable}
          togglePointer={togglePointer}
          onRecenterMarker={setViewTrue}
          copyLocationClickable={setDidCopyTrue}
          onChooseEpsgLocation={setIsClickableTrue}
        />
        {copyCoords ? <h2 className='app__coordinates'>Lat: {copyCoords.lat.toFixed(5)}, Lng: {copyCoords.lng.toFixed(5)}</h2> : <></>}
        <Dropdown text='Lat/Lng'>
          <LatLonForm onCoordinatesSubmit={onCoordinateSubmit} />
        </Dropdown>
        <Dropdown text='Find coordinates by EPSG'>
          <EpsgForm onCoordinatesSubmit={epsgConvert} />
        </Dropdown>

        <h3 className={`app__coordinates`}>Marker Lat/Lng coordinates: <br />{coords[0].toFixed(5)}, {coords[1].toFixed(5)}</h3>
        {epsgCoords[1] === coords[1] ? <h3 className='app__coordinates'>coordinates to EPSG:{fromEpsg}: <br />{epsgCoords[0]}, {epsgCoords[1]}</h3> : <></>}
        <h4 className='app__location-info'>Location info: <br />{address}</h4>
        {epsgTable[4] ? <Table data={epsgTable} isPreloader={isPreloader} tableHeaders={['Rank', 'Possible EPSG', 'Distance (km)']} /> : <></>}
      </div>
    </div >
  );
}
