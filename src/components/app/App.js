import React from 'react';
import proj4 from 'proj4';
import osmApiOBJ from '../../utils/osmApi';
import PrettyTable from '../prettyTable/PrettyTable';
import Map from '../map/Map';
import LatLonForm from '../form/LatLonForm';
import ButtonBox from '../buttonBox/ButtonBox';
import DropdownControl from '../dropdownControl/DropdownControl';
import EpsgForm from '../form/EpsgForm'
import Pointer from '../../images/pointer.svg';
import { calcDistance } from '../../constants/functions';
import FileInput from '../fileInput/FileInput';
import RadioMenu from '../radioMenu/RadioMenu';

export default function App() {
  const [coords, setCoords] = React.useState([31.89291, 35.03254]);
  const [copyCoords, setCopyCoords] = React.useState(null);
  const [address, setAddress] = React.useState('');
  const [epsgCoords, setEpsgCoords] = React.useState({});
  const [epsgTable, setEpsgTable] = React.useState([]);
  const [isClickable, setIsClickable] = React.useState(false);
  const [isView, setIsView] = React.useState(true);
  const [didCopy, setDidCopy] = React.useState(false);
  const [isPointer, setIsPointer] = React.useState(false);
  const [isRuler, setIsRuler] = React.useState(false);
  const [distance, setDistance] = React.useState(false);
  const [liveDistance, setLiveDistance] = React.useState(false);
  const [isEpsgFormFilled, setIsEpsgFormFilled] = React.useState(false);
  const [epsgForm, setEpsgForm] = React.useState({});   // eslint-disable-next-line
  const [list, setList] = React.useState([]);
  const [markersCoordinates, setMarkersCoordinates] = React.useState([]);
  const epsg = require('epsg');

  const togglePointer = () => {
    setIsPointer(!isPointer);
    if (isRuler === isPointer && isRuler) {
      setIsRuler(!isPointer);
    }
  };

  const toggleRuler = () => {
    setIsPointer(!isRuler);
    setIsRuler(!isRuler);
  };

  const setLiveDist = (dist) => {
    setLiveDistance(dist);
  };

  const setFileData = (data) => setList(data);

  const setIsEpsgFormFilledFalse = () => setIsEpsgFormFilled(false);

  const setViewTrue = () => setIsView(true);

  const setViewFalse = () => setIsView(false);

  const setIsClickableTrue = () => setIsClickable(true);

  const setDidCopyTrue = () => setDidCopy(true);

  const copyCoordsClick = (coords) => {
    setCopyCoords(coords);
    setDidCopy(false);
  };

  // ! Sends coordinates to the findEpsgCodes function
  const clickLocation = ({ latitude, longtitude }) => {
    setIsClickable(false);
    setEpsgCoords({ longtitude: longtitude.toFixed(4), latitude: latitude.toFixed(4) })
    findEpsgCodes({ coordins: { longtitude: longtitude, latitude: latitude }, form: epsgForm });
    setIsEpsgFormFilled(false);
  };

  // ! Converts location between different EPSG codes
  const epsgConvert = ({ fromEpsg, x, y, isX }) => {
    let fromProj = epsg[`EPSG:${fromEpsg}`];
    let toProj = epsg[`EPSG:4326`];
    let coordinates;
    if (isX) {
      setIsEpsgFormFilled(true);
      setEpsgForm({ x: x, y: y });
    } else {
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
  };

  // ! Get the info about the location found
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
  };

  // ! 
  const epsgMarkerChange = ({ fromEpsg }) => {
    let fromProj = epsg[`EPSG:${fromEpsg}`];
    let toProj4326 = epsg[`EPSG:4326`];
    let coordinates;
    let coordList = [];
    let newMarker = {};
    if (fromProj && list) {
      for (let i = 0; i < list.length; i += 2) {
        let y = list[i], x = list[i + 1];
        newMarker.originalCoordinates = { x: x, y: y };
        if (fromProj) {
          newMarker.isTable = false;
          if (toProj4326 === fromProj) {
            coordinates = proj4(fromProj, [y, x]);
            newMarker.wgs84Location = { latitude: coordinates[1].toFixed(4), longtitude: coordinates[0].toFixed(4) };
          } else {
            coordinates = proj4(fromProj, toProj4326, [y, x]);
            newMarker.wgs84Location = { latitude: coordinates[1].toFixed(4), longtitude: coordinates[0].toFixed(4) };

          }
          coordList[coordList.length] = Object.assign({}, newMarker);
        }
      }
      setMarkersCoordinates(coordList);
    }
  };

  // ! Creates a list of EPSG codes and renders the closest onces
  const findEpsgCodes = ({ coordins, form }) => {
    const toProj4326 = epsg[`EPSG:4326`];
    let coordinates;
    let arr = [];
    const { x, y } = form;
    let newEpsgObj = {};
    for (let i = 0; i < 33000; i++) {
      newEpsgObj.epsg = `EPSG:${2000 + i}`;
      const fromProj = epsg[`EPSG:${2000 + i}`];
      if (fromProj) {
        if (toProj4326 === fromProj) {
          coordinates = proj4(fromProj, [coordins.latitude, coordins.longtitude]);
          newEpsgObj.wgs84Location = { latitude: coordinates[0].toFixed(5), longtitude: coordinates[1].toFixed(5) };
        } else {
          coordinates = proj4(fromProj, toProj4326, [x, y]);
          newEpsgObj.wgs84Location = { latitude: coordinates[1].toFixed(5), longtitude: coordinates[0].toFixed(5) };
          newEpsgObj.distance = calcDistance({
            lat1: newEpsgObj.wgs84Location.latitude,
            lon1: newEpsgObj.wgs84Location.longtitude,
            lat2: coordins.latitude,
            lon2: coordins.longtitude
          });
        }
        addElementToArray(arr, newEpsgObj);
        newEpsgObj = {};
      }
    }
    arr.sort((a, b) => a.distance - b.distance);
    setEpsgTable([arr[0], arr[1], arr[2], arr[3], arr[4]]);
  };

  // ! Checks if the element should be added to the array
  const addElementToArray = (arr, elem) => {
    let shouldEnter = true;
    if (elem.wgs84Location && elem.distance < 14000) {
      elem.isTable = true;
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
  };

  // ! Calculates the air distance between the pointer and the cursor
  const rulerClick = (evt) => {
    if (evt) {
      const lat1 = evt.latlng.lat, lon1 = evt.latlng.lng;
      const lat2 = evt.target.getCenter().lat, lon2 = evt.target.getCenter().lng;
      const dist = calcDistance({ lat1, lon1, lat2, lon2 });
      if (dist) {
        setIsPointer(false);
        setIsRuler(false);
        setDistance(dist);
      }
    }
  };

  // ! Sets the map for the first time
  React.useEffect(() => {
    onCoordinateSubmit({ x: 35.03254, y: 31.89291 });   // eslint-disable-next-line
    // lengthOfLastWord('moon ');
  }, []);

  return (
    <div id='content'>
      <Map coords={coords}
        address={address}
        isClickable={isClickable}
        didCopy={didCopy}
        isRuler={isRuler}
        isView={isView}
        isPointer={isPointer}
        markersCoordinates={markersCoordinates}
        rulerClick={rulerClick}
        findEpsgClick={clickLocation}
        copyClicked={copyCoordsClick}
        setViewFalse={setViewFalse}
        setIsEpsgFormFilledFalse={setIsEpsgFormFilledFalse}
        setLiveDist={setLiveDist}
        markerData={epsgTable}>
        {isPointer ? <img src={Pointer} alt='Map pointer' className='app__map-pointer' /> : <></>}
      </Map>
      <div className='app__conteiner'>
        <ButtonBox isModi={copyCoords ? false : true}
          didCopy={didCopy}
          isPointer={isPointer}
          didEPSG={isClickable}
          isRuler={isRuler}
          isEpsgFormFilled={isEpsgFormFilled}
          togglePointer={togglePointer}
          toggleRuler={toggleRuler}
          onRecenterMarker={setViewTrue}
          copyLocationClickable={setDidCopyTrue}
          onChooseEpsgLocation={setIsClickableTrue}
        />
        {copyCoords ? <h2 className='app__coordinates'>Lat: {copyCoords.lat.toFixed(5)}, Lng: {copyCoords.lng.toFixed(5)}</h2> : <></>}
        <DropdownControl>
          <LatLonForm onSubmit={onCoordinateSubmit} />
          <RadioMenu>
            <EpsgForm markersChange={epsgMarkerChange} onSubmit={epsgConvert} />
            <FileInput onFileChoose={setFileData} />
          </RadioMenu>
        </DropdownControl>
        <h3 className={`app__coordinates`}>Marker Lat/Lng coordinates: <br />{coords[0].toFixed(5)}, {coords[1].toFixed(5)}</h3>
        <h4 className='app__location-info'>Location info: <br />{address}</h4>
        {distance ? <h3 className='app__distance'>Final distance: {distance} km</h3> : <></>}
        {epsgTable[4] ? <PrettyTable data={epsgTable} tableHeaders={['Rank', 'Possible EPSG', 'Distance (km)']} coordinates={epsgCoords} /> : <></>}
        {isRuler ? <h3 className='app__distance'>live distance: {liveDistance} km</h3> : <></>}
      </div>
    </div >
  );
}
