var map = {},
    mapOptions = {
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9'
    };

var options = {
  countryFills: {
    'id': 'country-fills',
    'type': 'fill',
    'source': 'countries',
    'layout': {},
    'paint': {
      'fill-color': '#627BC1',
      'fill-opacity': 0.5
    }
  },
  countryBorders: {
    'id': 'country-borders',
    'type': 'line',
    'source': 'countries',
    'layout': {},
    'paint': {
      'line-color': '#627BC1',
      'line-width': 2
    }
  },
  routeHover: {
    'id': 'route-hover',
    'type': 'fill',
    'source': 'countries',
    'layout': {},
    'paint': {
      'fill-color': '#627BC1',
      'fill-opacity': 1
    },
    'filter': ['==', 'name', '']
  },
  poleMarkers: {
    'id': 'pole-markers',
    'type': 'circle',
    'source': 'poles',
    'layout': {},
    'paint': {
      'circle-color': '#627BC1',
      'circle-radius': {
        'base': 1.75,
        'stops': [[12, 2], [22, 180]]
      }
    }
  },
  poleHighlight: {
    'id': 'pole-highlight',
    'type': 'circle',
    'source': 'poles',
    'layout': {},
    'paint': {
      'circle-color': 'yellow',
      'circle-radius': {
        'base': 1.5,
        'stops': [[12, 2], [22, 180]]
      }
    },
    'filter': ['==', 'publicid', '']
  }
};

angular.module('vt-demo')
  .factory('mapFactory', function($rootScope) {

    return {

      initMap: function() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsaXZpbnNraWNhcnRvIiwiYSI6IjRWenpDcmMifQ.IU9qcKhUf_w-lTQQ-I7DIg';

        map = window.map = new mapboxgl.Map(mapOptions);
        map.flying = false;
        map.on('moveend', function(e){
          if (this.flying) { map.fire('flyend'); }
        });
        // map.on('mousemove', function (e) {
        //   var features = map.queryRenderedFeatures(e.point, { layers: ['country-fills'] });
        //   if (features.length) {
        //     map.setFilter('route-hover', ['==', 'name', features[0].properties.name]);
        //   } else {
        //     map.setFilter('route-hover', ['==', 'name', '']);
        //   }
        // });
        //
        // // Reset the route-hover layer's filter when the mouse leaves the map
        // map.on('mouseout', function () {
        //   map.setFilter('route-hover', ['==', 'name', '']);
        // });
        //
        map.on('mousedown', function (e) {
          var features = map.queryRenderedFeatures(e.point, { layers: ['pole-markers'] });

          if (features.length) {
            map.setFilter('pole-highlight', ['==', 'publicid', features[0].properties.publicid]);
          } else {
            map.setFilter('pole-highlight', ['==', 'publicid', '']);
          }
        });

        map.on('load', function() {
          $rootScope.$broadcast('map:loaded');
        });
      },

      addCountries: function(geoJson) {
        map.addSource('countries', {
          'type': 'geojson',
          'data': geoJson
        });

        map.addLayer(options.countryFills);
        map.addLayer(options.countryBorders);
        map.addLayer(options.routeHover);
      },

      addPoles: function(geoJson) {
        map.flying = true;
        map.flyTo({
          center: { lng: -82.97113458848199, lat: 39.974203933947024 },
          zoom: 9.5
        });
        map.once('flyend', function() {
          map.addSource('poles', {
            'type': 'geojson',
            'data': geoJson
          });

          map.addLayer(options.poleMarkers);
          map.addLayer(options.poleHighlight);

        });
      }

    };
  });
