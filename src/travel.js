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

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-right');
map.scrollZoom.disable();

const createPlacePin = cities => {
  return Promise.all(
    cities.map(place =>
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

            feature.properties = {
              ...feature.properties,
              title: place.city,
              icon: 'star'
            };

            return feature;

            // const marker = new mapboxgl.Marker({
            //   title: place.city,
            //   'marker-color': '#9c89cc',
            //   'marker-size': 'medium',
            //   'marker-symbol': 'building'
            // })
            //   .setLngLat(feature.center)
            //   .setPopup(
            //     new mapboxgl.Popup({ offset: 25 })
            //       .setText(feature.properties.title)
            //       .setHTML(`<h3>${feature.properties.title}</h3>`)
            //   )
            //   .addTo(map);
          }
        })
    )
  );
};

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
      'fill-color': '#627ccb', //this is the color you want your tileset to have
      'fill-outline-color': '#85a3ff', //this helps us distinguish individual countries a bit better by giving them an outline
      'fill-opacity': 0.8
    }
  });

  map.setFilter(
    'countries-visited',
    ['in', 'ADM0_A3_IS'].concat(places.map(({ country }) => country))
  );

  createPlacePin(places).then(features => {
    map.addLayer({
      id: 'places',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        }
      },
      layout: {
        'icon-image': '{icon}-15',
        'icon-allow-overlap': true
      }
    });

    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mouseenter', 'places', function(e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';

      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.title;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
    });

    map.on('mouseleave', 'places', function() {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
  });

  // places.forEach(createPlacePin);
});

module.exports = map;
