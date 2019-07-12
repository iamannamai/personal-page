const mapboxgl = require('mapbox-gl');
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
map.scrollZoom.disable();

module.exports = map;
