angular.module('vt-demo', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('homepage', {
        url: '/',
        templateUrl: 'views/pages/homepage.html',
        controller: function ($scope) {
          var map = {},
              mapOptions = {
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v9'
              };

          $scope.loc = 0;

          $scope.locations = [
            {
              name: 'buffalo',
              data: {
                center: [ -78.8784, 42.8864 ],
                zoom: 14
              }
            },
            {
              name: 'madison',
              data: {
                center: [-89.4012, 43.0731],
                zoom: 12
              }
            },
            {
              name: 'neenah',
              data: {
                center: [-88.4626, 44.1858],
                zoom: 14
              }
            },
            {
              name: 'port alsorth',
              data: {
                center: [-154.3128, 60.2025],
                zoom: 12
              }
            },
            {
              name: 'madison',
              data: {
                center: [-89.4012, 43.0731],
                zoom: 12
              }
            },
            {
              name: 'spirit lake',
              data: {
                center: [-95.1022, 43.4226],
                zoom: 12
              }
            },
            {
              name: 'madison',
              data: {
                center: [-89.4012, 43.0731],
                zoom: 12
              }
            },
            {
              name: 'neenah',
              data: {
                center: [-88.4626, 44.1858],
                zoom: 14
              }
            },
            {
              name: 'oshkosh',
              data: {
                center: [-88.5216, 44.0247],
                zoom: 12
              }
            }
          ];

          function init () {
            mapboxgl.accessToken = 'pk.eyJ1IjoiZXNsaXZpbnNraWNhcnRvIiwiYSI6IjRWenpDcmMifQ.IU9qcKhUf_w-lTQQ-I7DIg';

            mapOptions = _.extend(mapOptions, $scope.locations[$scope.loc].data);
            map = window.map = new mapboxgl.Map(mapOptions);
          }

          $scope.fly = function () {
            $scope.loc = $scope.locations[$scope.loc + 1] ? $scope.loc + 1 : 0;
            map.flyTo($scope.locations[$scope.loc].data);
          };

          init();
        }
      });
  });
