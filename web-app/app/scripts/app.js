'use strict';

/**
 * @ngdoc overview
 * @name rotApp
 * @description
 * # rotApp
 *
 * Main module of the application.
 */
angular
  .module('rotApp', [
    'ngRoute',
    'ui.codemirror',
    'angularSoap',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
