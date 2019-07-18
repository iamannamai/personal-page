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
    id: 'countries-visited',
    source: {
      type: 'vector',
      url: 'mapbox://annamai.bo1h1cab' // tileset ID
    },
    'source-layer': 'ne_10m_admin_0_countries-9ztbud',
    type: 'fill',
    paint: {
      'fill-color': '#627ccb', //this is the color you want your tileset to have (I used a nice purple color)
      'fill-outline-color': '#85a3ff' //this helps us distinguish individual countries a bit better by giving them an outline
    }
  });

  map.setFilter(
    'countries-visited',
    ['in', 'ADM0_A3_IS'].concat(places.map(({ country }) => country))
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
        new mapboxgl.Marker({
          title: place.city
        })
          .setLngLat(feature.center)
          .addTo(map);
      }
    });
};

places.forEach(createPlacePin);

module.exports = map;
