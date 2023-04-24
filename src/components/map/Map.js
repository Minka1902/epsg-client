import 'regenerator-runtime';
import 'leaflet/dist/leaflet.css';
import leafletImage from 'leaflet-image';
import { MapContainer, Tooltip, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl, Polyline } from "react-leaflet";
import React from 'react';
import domtoimage from 'dom-to-image';
import { maps } from '../../constants/mapOptions';
import { greenMarker, blackMarker, blueMarker, customMarker2 } from '../../constants/markers';
import { calcDistance, shortenString } from '../../constants/functions';

export default function Map({ coords, format, markersCoordinates, bbox, setLiveDist, address, isRuler, rulerClick, markerData, setIsEpsgFormFilledFalse, isClickable, findEpsgClick, copyClicked, didCopy, isView, children, setViewFalse }) {
  const { BaseLayer } = LayersControl;
  const mapRef = React.useRef();
  const [rulerCoords, setRulerCoords] = React.useState([[51.505, -0.09], [51.507, -0.08]]);
  const [markerArray, setMarkerArray] = React.useState([]);
  const [isMarkers, setIsMarker] = React.useState(false);

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
      setIsMarker(true);
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

  const handleExportImage = (evt) => {
    if (evt) {
      const node = document.getElementById('map');
      domtoimage.toPng(node)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'map.png'; // ! downloads the image.png as map.png
          link.click();
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    }
    if (mapRef.current) {
      const map = mapRef.current;
      leafletImage(map, (err, canvas) => {
        if (err) {
          console.error('Error exporting map as image:', err);
        } else {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'map.png'; // ! downloads the image.png as map.png
          link.click();
        }
      });
    }
  };

  // ? creates one big array of markers
  React.useEffect(() => {
    let tempArray = [];
    for (let i = 0; i < markerData.length; i++) {
      if (!isNaN(markerData[i].wgs84Location.longtitude) && !isNaN(markerData[i].wgs84Location.latitude)) {
        if (markerData[i].wgs84Location.longtitude !== Infinity && markerData[i].wgs84Location.latitude !== Infinity) {
          if (markerData[i].wgs84Location.longtitude && markerData[i].wgs84Location.latitude) {
            tempArray[tempArray.length] = Object.assign({}, markerData[i]);
          }
        }
      }
    }
    for (let i = 0; i < markersCoordinates.length; i++) {
      if (!isNaN(markersCoordinates[i].wgs84Location.latitude) && !isNaN(markersCoordinates[i].wgs84Location.longtitude)) {
        if (markersCoordinates[i].wgs84Location.longtitude !== Infinity && markersCoordinates[i].wgs84Location.latitude !== Infinity) {
          if (markersCoordinates[i].wgs84Location.longtitude && markersCoordinates[i].wgs84Location.latitude) {
            tempArray[tempArray.length] = Object.assign({}, markersCoordinates[i]);
          }
        }
      }
    }
    setMarkerArray(tempArray);
  }, [markersCoordinates, markerData]);

  // ? once the bounding box is set it will open
  React.useEffect(() => {
    const map = mapRef.current;
    if (bbox[3]) {
      const bounds = [
        [bbox[0], bbox[2]],
        [bbox[1], bbox[3]],
      ];
      map.whenReady(() => {
        map.fitBounds(bounds);
        handleExportImage();
      });
    }
  }, [bbox]);

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
        ref={mapRef}
      >

        <Pointer />
        {children}
        <SetViewOnClick coords={coords} isActive={isView} setViewFalse={setViewFalse} />
        {isClickable || didCopy ? <ClickLocation /> : <></>}

        <Tooltip sticky />
        {isMarkers ? <Marker position={coords} icon={blueMarker}>
          <Popup>
            {address ? address : `We dont have any information about this location.`}
          </Popup>
        </Marker> : <></>}

        {isRuler ?
          <Polyline positions={rulerCoords} />
          :
          <></>}

        {isMarkers ? markerArray.map((marker, index) => (
          marker.isTable ?
            <Marker key={index} icon={index === 0 ? greenMarker : blackMarker} position={[marker.wgs84Location.latitude, marker.wgs84Location.longtitude]}>
              <Popup>
                <p>{marker.epsg}, {marker.distance} km <br />Lat:{marker.wgs84Location.latitude}, Lng:{marker.wgs84Location.longtitude}</p>
              </Popup>
            </Marker>
            :
            <Marker key={index} icon={customMarker2} position={[marker.wgs84Location.latitude, marker.wgs84Location.longtitude]}>
              <Popup>
                <p>Y: {marker.originalCoordinates.y}, X: {marker.originalCoordinates.x}</p>
              </Popup>
            </Marker>
        )) : <></>}

        <LayersControl>   {/* eslint-disable-next-line */}
          {maps.map((map, index) => {
            if (map.valid) {
              return (
                <BaseLayer checked={map.name.toLowerCase() === format ? true : map.checked} name={map.name} key={index}>
                  <TileLayer
                    className='TileLayer'
                    url={map.url}
                    attribution={shortenString(map.attribution)}
                  />
                </BaseLayer>);
            }
          })}
        </LayersControl>
      </MapContainer>
      <div className='button__export' id='export' onClick={handleExportImage} title='Download map as jpeg' ></div>
    </div>
  );
}
