var map = {},
    mapOptions = {
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9'
    },
    Draw = mapboxgl.Draw({displayControlsDefault : false}),
    poles = {};

var options = {
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
    },
    'filter': ['none']
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

    var factory = window.factory = {

      initMap: function() {
        var self = this;
        mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsaXZpbnNraWNhcnRvIiwiYSI6IjRWenpDcmMifQ.IU9qcKhUf_w-lTQQ-I7DIg';

        map = window.map = new mapboxgl.Map(mapOptions);
        map.flying = false;
        map.editing = false;
        map.on('moveend', function(event) {
          if (this.flying) { map.fire('flyend'); }
        });

        map.on('mousedown', function (event) {
          map.setFilter('pole-highlight', ['==', 'publicid', '']);

          var features = map.queryRenderedFeatures(event.point, { layers: ['pole-markers'] });

          if (!features.length) { return; }

          var feature = _.head(features),
              featureId = _.get(feature, 'properties.publicid');

          if (map.editing) {
            var hidden = _.cloneDeep(map.getFilter('pole-markers'));
            hidden[0] = 'none';
            hidden.push(['==', 'publicid', featureId]);
            map.setFilter('pole-markers', hidden);
            return self.edit(feature, featureId);
          }
          map.setFilter('pole-highlight', ['==', 'publicid', featureId]);
        });

        map.on('load', function() {
          map.addControl(Draw);
          $rootScope.$broadcast('map:loaded');
        });
      },

      addPoles: function(geoJson) {
        map.flying = true;
        map.flyTo({
          center: { lng: -82.97113458848199, lat: 39.974203933947024 },
          zoom: 11
        });
        map.once('flyend', function(event) {
          poles = new mapboxgl.GeoJSONSource({ 'data': geoJson });
          map.addSource('poles', poles);
          map.addLayer(options.poleMarkers);
          map.addLayer(options.poleHighlight);
        });
      },

      update: function() {
        var drawCollection = Draw.getAll(),
            updateCollection = poles._data;

        _.each(drawCollection.features, function(drawFeature) {
          drawFeature.properties.publicid = drawFeature.id;
          updateCollection.features.push(drawFeature);
        });

        Draw.deleteAll();
        poles.setData(updateCollection);
      },

      toggleEditing: function (value) {
        map.editing = value;
      },

      draw: function(geomType) {
        var mode = geomType === 'line' ? 'draw_line_string' :
            geomType === 'point' ? 'draw_point' :
            geomType === 'polygon' ? 'draw_polygon' : false;

        if (mode) {
          Draw.changeMode(mode);
          $rootScope.$broadcast('draw:start', { geomType: geomType });
        }
      },

      edit: function (feature, featureId) {
        var geom = feature.toJSON().geometry;
        // Reduce coord precision
        geom.coordinates = _.map(feature.geometry.coordinates, function(coord) {
          return _.round(coord, 5);
        });
        geom.id = featureId;
        Draw.add(geom);
      }
    };

    return factory;
  });
