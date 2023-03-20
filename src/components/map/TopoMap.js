import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import options from '../../constants/mapOptions';

export default function TopoMap({ topoData }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize map
    const map = L.map(mapRef.current);

    // Add tile layer (e.g. Mapbox)
    L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={${options.token}}`, {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: `${options.token}`
    }).addTo(map);

    // Add topo data as a GeoJSON layer
    L.geoJSON(topoData).addTo(map);
  }, [topoData]);

  return <div ref={mapRef} style={{ height: '400px' }} />;
}
