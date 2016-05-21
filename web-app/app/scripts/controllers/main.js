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

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      matchBrackets: true,
      indentWithTabs: true,
      tabMode: 'shift',
      mode: 'php',
      autofocus: true,
    };

    $scope.code = '<?php\necho "Hello World";\n?>';
    $scope.console = {
      output: 'Здесь будут отображаться результаты работы программы',
    };


  });
