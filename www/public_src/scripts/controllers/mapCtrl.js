angular.module('vt-demo')
.controller('mapCtrl', function ($scope, $rootScope, $http, mapFactory) {

  $scope.mode = {
    options: ['line', 'polygon', 'point'],
    current: null
  };

  $scope.$on('map:loaded', function() {
    $http.get('./data/utility_poles.json')
      .then(function(results) {
        var geojson = results.data.geojson;
        _.each(geojson.features, function(feature) {
          feature.id = feature.properties.publicid;
        });
        mapFactory.addPoles(geojson);
      });
  });

  $scope.$on('draw:start', function(event, data) {
    $scope.mode.current = data.geomType;
  });

  $scope.draw = mapFactory.draw;

  $scope.editing = false;

  $scope.toggleEditing = function() {
    if ($scope.editing) {
      mapFactory.update();
    }
    $scope.editing = !$scope.editing;
    mapFactory.toggleEditing($scope.editing);
  };

  function init () {
    mapFactory.initMap();
  }

  init();
});
