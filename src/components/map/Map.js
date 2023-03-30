import 'regenerator-runtime';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl, Polyline } from "react-leaflet";
import React from 'react';
import { maps, greenMarker } from '../../constants/mapOptions';

function SetViewOnClick({ coords, isActive, setViewFalse }) {
  const map = useMap();
  if (isActive) {
    map.flyTo(coords, 18);
    setViewFalse();
  }

  return null;
}

export default function Map({ coords, address, isRuler, rulerClick, markerData, setIsEpsgFormFilledFalse, isClickable, findEpsgClick, copyClicked, didCopy, isView, children, setViewFalse }) {
  const { BaseLayer } = LayersControl;
  const [rulerCoords, setRulerCoords] = React.useState([[51.505, -0.09], [51.507, -0.08]]);

  function ClickLocation() { // eslint-disable-next-line
    const map = useMapEvents({
      click(evt) {
        if (isClickable) {
          findEpsgClick({ latitude: evt.latlng.lat, longtitude: evt.latlng.lng });
          setIsEpsgFormFilledFalse();
        } else {
          if (didCopy) {
            copyClicked(evt.latlng)
          }
        }
      },
    });
    return null;
  }

  // function Locate() {
  //   const map = useMapEvents({
  //     click() {
  //       map.locate()
  //     },
  //     locationfound(e) {
  //       map.flyTo(e.latlng, map.getZoom())
  //     },
  //   })
  // }

  function Pointer() {  // eslint-disable-next-line
    const map = useMapEvents({
      mousemove: (evt) => {
        if (evt.originalEvent.currentTarget) {
          const { lat, lng } = evt.target.getCenter();
          setRulerCoords([[lat, lng], [evt.latlng.lat, evt.latlng.lng]]);
        }
      },
      click: (evt) => {
        if (evt && isRuler) {
          rulerClick(evt);
        }
      },
    })
  }

  return (
    <div id='map'>
      <MapContainer
        center={coords}
        zoom={4}
        minZoom={3}
        maxZoom={18}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <Pointer />
        {children}
        <SetViewOnClick coords={coords} isActive={isView} setViewFalse={setViewFalse} />
        {isClickable || didCopy ? <ClickLocation /> : <></>}

        <Marker
          position={coords}
          icon={new L.Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [0, -35] })}
        >
          <Popup>
            {address ? address : `We dont have any information about this location.`}
          </Popup>
        </Marker>

        {markerData.map((marker, index) => (
          <Marker key={index} icon={greenMarker} position={[marker.wgs84Location.latitude, marker.wgs84Location.longtitude]}>
            <Popup>
              <p>{marker.epsg}, {marker.distance} km <br />Lat:{marker.wgs84Location.latitude}, Lng:{marker.wgs84Location.longtitude} </p>
            </Popup>
          </Marker>
        ))}

        {isRuler ?
          <Polyline pathOptions={{ color: 'black', weight: '3', dashArray: '20, 20', dashOffset: '20' }} positions={rulerCoords} />
          :
          <></>}

        <LayersControl>   {/* eslint-disable-next-line */}
          {maps.map((map, index) => {
            if (map.valid) {
              return (
                <BaseLayer checked={map.checked} name={map.name} key={index}>
                  <TileLayer
                    className='TileLayer'
                    url={map.url}
                    attribution={map.attribution}
                  />
                </BaseLayer>);
            }
          })}
        </LayersControl>
      </MapContainer>
    </div>
  );
}
