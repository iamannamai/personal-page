const mapboxgl = require('mapbox-gl');
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
const { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } = require('./constants');

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: MAPBOX_STYLE,
  zoom: 1.2,
  // zoom: 12,
  center: [15, 25]
});
const nav = new mapboxgl.NavigationControl();

map.addControl(nav, 'top-right');
map.addControl(
  new MapboxGeocoder({
    accessToken: MAPBOX_ACCESS_TOKEN,
    mapboxgl: mapboxgl
  })
);
map.scrollZoom.disable();

// map.geocoding
//   .forwardGeocode({
//     query: 'Wellington, New Zealand',
//     autocomplete: false,
//     limit: 1
//   })
//   .send()
//   .then(function(response) {
//     console.log(response);
//     if (
//       response &&
//       response.body &&
//       response.body.features &&
//       response.body.features.length
//     ) {
//       const feature = response.body.features[0];
//       new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
//     }
//   });

module.exports = map;
