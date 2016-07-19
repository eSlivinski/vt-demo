angular.module('vt-demo')
.controller('mapCtrl', function ($scope, $rootScope, $http, mapFactory) {

  function init () {
    mapFactory.initMap();

    // $http.get('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    //   .then(function(results) {
    //     countries = results.data;
    //   });
  }

  $scope.$on('map:loaded', function() {

    $http.get('./data/utility_poles.json')
      .then(function(results) {
        mapFactory.addPoles(results.data.geojson);
        poles = results;
      });
  });

  init();
});
