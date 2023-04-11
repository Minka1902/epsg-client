import 'regenerator-runtime';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Tooltip, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl, Polyline } from "react-leaflet";
import React from 'react';
import { maps } from '../../constants/mapOptions';
import { greenMarker, blackMarker, blueMarker, redMarker, customMarker2 } from '../../constants/markers';
import { calcDistance } from '../../constants/functions';

export default function Map({ coords, markersCoordinates, setLiveDist, address, isRuler, rulerClick, markerData, setIsEpsgFormFilledFalse, isClickable, findEpsgClick, copyClicked, didCopy, isView, children, setViewFalse }) {
  const { BaseLayer } = LayersControl;
  const [rulerCoords, setRulerCoords] = React.useState([[51.505, -0.09], [51.507, -0.08]]);
  const [markerArray, setMarkerArray] = React.useState([]);

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

  function SetViewOnClick({ coords, isActive, setViewFalse }) {
    const map = useMap();
    if (isActive) {
      map.flyTo(coords, 18);
      setViewFalse();
    }

    return null;
  }

  function Pointer() {  // eslint-disable-next-line
    const map = useMapEvents({
      mousemove: (evt) => {
        if (evt.originalEvent.currentTarget) {
          const { lat, lng } = evt.target.getCenter();
          setRulerCoords([[lat, lng], [evt.latlng.lat, evt.latlng.lng]]);
          setLiveDist(calcDistance({ lat1: lat, lon1: lng, lat2: evt.latlng.lat, lon2: evt.latlng.lng }))
        }
      },
      click: (evt) => {
        if (evt && isRuler) {
          rulerClick(evt);
        }
      },
    });
  }

  React.useEffect(() => {
    let tempArray = [];
    for (let i = 0; i < markerData.length; i++) {
      if (markerData[i].wgs84Location.latitude !== NaN && markerData[i].wgs84Location.latitude !== Infinity && markerData[i].wgs84Location.latitude) {
        if (markerData[i].wgs84Location.longtitude !== NaN && markerData[i].wgs84Location.longtitude !== Infinity && markerData[i].wgs84Location.longtitude) {
          tempArray[tempArray.length] = Object.assign({}, markerData[i]);
        }
      }
    }
    for (let i = 0; i < markersCoordinates.length; i++) {
      if (markersCoordinates[i].wgs84Location.latitude !== 'NaN' && markersCoordinates[i].wgs84Location.latitude !== Infinity) {
        if (markersCoordinates[i].wgs84Location.longtitude !== NaN && markersCoordinates[i].wgs84Location.longtitude !== Infinity) {
          tempArray[tempArray.length] = Object.assign({}, markersCoordinates[i]);
        }
      }
    }
    setMarkerArray(tempArray);
  }, [markersCoordinates, markerData])

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

        <Tooltip sticky />
        <Marker position={coords} icon={blueMarker}>
          <Popup>
            {address ? address : `We dont have any information about this location.`}
          </Popup>
        </Marker>

        {isRuler ?
          <Polyline positions={rulerCoords} />
          :
          <></>}

        {markerArray.map((marker, index) => (
          marker.isTable ?
            <Marker key={index} icon={index === 0 ? greenMarker : blackMarker} position={[marker.wgs84Location.latitude, marker.wgs84Location.longtitude]}>
              <Popup>
                <p>{marker.epsg}, {marker.distance} km <br />Lat:{marker.wgs84Location.latitude}, Lng:{marker.wgs84Location.longtitude}</p>
              </Popup>
            </Marker>
            :
            <Marker key={index} icon={customMarker2} position={[marker.wgs84Location.latitude, marker.wgs84Location.longtitude]}>
              <Popup>
                <p>Lat: {marker.wgs84Location.latitude}, Lng: {marker.wgs84Location.longtitude}</p>
              </Popup>
            </Marker>
        ))}

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
