import React from 'react';
import osmApiOBJ from '../../utils/osmApi';
import Map from '../map/Map';
import LatLonForm from '../form/LatLonForm';
import proj4 from 'proj4';
import Checkbox from '../form/Checkbox';

export default function App() {
  const [coords, setCoords] = React.useState([35.9308, 14.3845]);
  const [address, setAddress] = React.useState('');
  const [epsgCoords, setEpsgCoords] = React.useState([]);
  const [fromEpsg, setFromEpsg] = React.useState('');
  const [bBox, setBBox] = React.useState([336000, 354000, 9684000, 9702000]);
  const [latlngClick, setlatlngClick] = React.useState(null);
  const [isTopo, setIsTopo] = React.useState('');

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
          setBBox(data.boundingbox);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(`Coordinate search error: ${err}`);
        }
      });
  }

  React.useEffect(() => {
    onCoordinateSubmit({ x: 14.3845, y: 35.9308 });   // eslint-disable-next-line
    // searchTopo();                                     // eslint-disable-next-line
  }, []);

  const searchTopo = () => {
    // osmApiOBJ.topoGeomage({ epsg: '29191', coords: bBox, step: 100 })
    //   .then((data) => {
    //     if (data) {
    //       // const bodyContent = findElementByName(data, 'body');
    //       // setNewComponent(bodyContent);
    //       console.log(data);
    //     }
    //   })
    //   .catch((err) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //   })
  };

  const toggleTopo = (isChecked) => {
    if (isChecked) {
      setIsTopo(isChecked);
    }
  }

  return (
    <div id='content'>
      <Map coords={coords}
        address={address}
        setlatlngClick={setlatlngClick}
        isTopo={isTopo}
      />
      <div className='app__conteiner'>
        <LatLonForm onSubmit={epsgConvert} />
        <Checkbox onToggle={toggleTopo} text='Show Topographic Map' />
        <h3 onClick={searchTopo} className='app__coordinates'>Lan/Lng coordinates EPSG 4326: <br />{coords[0].toFixed(5)}, {coords[1].toFixed(5)}</h3>
        {epsgCoords[1] ? <h3 className='app__coordinates'>coordinates to EPSG:{fromEpsg}: <br />{epsgCoords[0]}, {epsgCoords[1]}</h3> : <></>}
        <h4 className='app__location-info'>Location info: <br />{address}</h4>
        {/* <EpsgForm onSubmit={epsgConvert} /> */}
        {/* <h3 className='app__coordinates'>To EPSG 4326 coordinates: <br />{newCoords[0].toFixed(5)}, {newCoords[1].toFixed(5)}</h3> */}
        {/* <Checkbox onToggle={onToggle} text=' Show clicked location' /> */}
      </div>
    </div>
  );
}
