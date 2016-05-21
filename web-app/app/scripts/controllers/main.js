'use strict';

/**
 * @ngdoc function
 * @name rotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rotApp
 */
angular.module('rotApp')
  .controller('MainCtrl', function ($scope) {
    $scope.code = '// Начните писать код здесь...';
    $scope.console = {
      output: 'Здесь будут отображаться результаты работы программы',
    };
  });
