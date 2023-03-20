import 'regenerator-runtime';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, GeoJSON } from "react-leaflet";
import React from 'react';
import Topography from 'leaflet-topography';
import options from '../../constants/mapOptions';

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, 18);

  return null;
};

export default function Map({ coords, address, setlatlngClick, isTopo }) {
  const [mapData, setMapData] = React.useState(null);

  const LocationFinderDummy = () => {
    const map = useMapEvents({
      click(evt) {
        Topography.getTopography(evt.latlng, options)
          .then((data) => {
            // setlatlngClick(data.elevation);
            console.log(`Elevation: ${data.elevation}`);
          })
          .catch((err) => {
            console.log(`Map click error: ${err}`);
          });
      },
    });
    return null;
  };

  // React.useEffect(() => {
  //   const query = `[out:json];way["contour"="500"](${bBox});(._;>;);out body;`;

  //   osmApiOBJ.topo(query)
  //     .then((data) => {
  //       if (data) {
  //         console.log(data);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err) {
  //         console.log(`topo Error: ${err}`);
  //       }
  //     })
  // }, []);

  return (
    <div id='map'>
      <MapContainer
        center={coords}
        zoom={14}
        minZoom={3}
        maxZoom={18}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <SetViewOnClick coords={coords} />
        <LocationFinderDummy />

        <Marker
          position={coords}
          icon={new L.Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -35] })}
        >
          <Popup>
            {address ? address : `We dont have any information about this location.`}
          </Popup>
        </Marker>

        <TileLayer
          className='TileLayer'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {isTopo ? <GeoJSON data={mapData} style={{ fillOpacity: 0, color: 'black' }} /> : <></>}

      </MapContainer>
    </div>
  );
}
