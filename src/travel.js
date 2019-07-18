const mapboxgl = require('mapbox-gl');
const mpbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { MAPBOX_ACCESS_TOKEN, MAPBOX_STYLE } = require('./constants');
const places = require('./places.json');

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
const geocodingClient = mpbxGeocoding({ accessToken: mapboxgl.accessToken });

const map = new mapboxgl.Map({
  container: 'map',
  // style: 'mapbox://styles/annamai/cjy7zjh2q0fsf1cqou84o563w',
  style: MAPBOX_STYLE,
  zoom: 1.2,
  center: [15, 25]
});

map.on('load', function() {
  //On map load, we want to do some stuff
  map.addLayer({
    //here we are adding a layer containing the tileset we just uploaded
    id: 'annamai.bo1h1cab',
    source: {
      type: 'vector',
      url: MAPBOX_STYLE
    },
    'source-layer': 'ne_10m_admin_0_countries-9ztbud',
    type: 'fill',
    paint: {
      'fill-color': '#52489C', //this is the color you want your tileset to have (I used a nice purple color)
      'fill-outline-color': '#F2F2F2' //this helps us distinguish individual countries a bit better by giving them an outline
    }
  });

  map.setFilter(
    'annamai.bo1h1cab',
    ['in', 'ADM0_A3_IS'].concat(['USA', 'AUS', 'NGA'])
  );
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');
map.scrollZoom.disable();
// console.dir(mapboxClient);

const createPlacePin = place => {
  geocodingClient
    .forwardGeocode({
      query: place.city,
      autocomplete: false,
      limit: 1
    })
    .send()
    .then(function(response) {
      if (
        response &&
        response.body &&
        response.body.features &&
        response.body.features.length
      ) {
        const feature = response.body.features[0];
        new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
      }
    });
};

places.forEach(createPlacePin);

module.exports = map;
