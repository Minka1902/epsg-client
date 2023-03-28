import 'regenerator-runtime';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import * as L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl } from "react-leaflet";
import React from 'react';
import { maps } from '../../constants/mapOptions';

function SetViewOnClick({ coords, isActive, setViewFalse }) {
  const map = useMap();
  if (isActive) {
    map.flyTo(coords, 18);
    setViewFalse();
  }

  return null;
};

const greenMarker = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function Map({ coords, address, markerData, isClickable, findEpsgClick, copyClicked, didCopy, isView, children, setViewFalse }) {
  const { BaseLayer } = LayersControl;

  const ClickLocation = () => {
    const map = useMapEvents({
      click(evt) {
        if (isClickable) {
          findEpsgClick({ latitude: evt.latlng.lat, longtitude: evt.latlng.lng })
        } else {
          if (didCopy) {
            copyClicked(evt.latlng)
          }
        }
      },
    });
    return null;
  };

  function Locate() {
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  }

  function Pointer() {
    const map = useMapEvents({
      click(evt) {
        if (evt) {
          const offsetX = evt.originalEvent.currentTarget.offsetHeight / 2;
          const offsetY = evt.originalEvent.currentTarget.offsetWidth / 2;
          var layerPoint = L.point(offsetX, offsetY);
          var latlng = map.layerPointToLatLng(layerPoint);
        }
      }
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
          <Marker key={index} icon={greenMarker} position={[marker.corespondingLocation.longtitude, marker.corespondingLocation.latitude]}>
            <Popup>
              <p>{marker.epsg}, {marker.distance} km <br />Lat:{marker.corespondingLocation.latitude}, Lng:{marker.corespondingLocation.longtitude} </p>
            </Popup>
          </Marker>
        ))}

        <LayersControl>
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
