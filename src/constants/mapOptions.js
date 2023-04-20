export const options = {
    mapboxToken: 'pk.eyJ1IjoibWlua2ExOTAyIiwiYSI6ImNsZmIza2MxOTAxdjYzcXBqYmhxdDM4ZmsifQ.6KidVCNmWrz-aq0JP2LYaQ',
    cyclemapToken: '6170aad10dfd42a38d4d8c709a536f38',
}

export const maps = [
    { valid: true, checked: false, name: "Standart", url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' },
    { valid: true, checked: false, name: "Topography", url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' },
    { valid: true, checked: false, name: "Satellite", url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`, attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' },
    { valid: false, checked: false, name: "Cycle", url: `https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=${options.cyclemapToken}`, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' },
    { valid: false, checked: false, name: "Google maps", url: `http://mts3.google.com/vt/lyrs=m&x={x}&y={y}&z={z}`, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' },
    { valid: false, checked: false, name: "topo", url: `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`, attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>' },
    { valid: false, checked: false, name: "Standard english", url: `https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key={apikey}`, attribution: '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
]
