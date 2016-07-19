angular.module('vt-demo', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('homepage', {
        url: '/',
        templateUrl: 'views/pages/homepage.html',
        controller: 'mapCtrl'
      });
  });
