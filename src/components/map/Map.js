import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import React from 'react';

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.setView(coords, 18);

  return null;
}

export default function Map({ coords, address }) {
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

        <Marker
          position={coords}
          icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -35] })}
        >
          <Popup>
            {address ? address: `We dont have any information about this location.`}
          </Popup>
        </Marker>

        <TileLayer
          className='TileLayer'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </MapContainer>
    </div>
  );
}
