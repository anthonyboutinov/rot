'use strict';

/**
 * @ngdoc function
 * @name rotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rotApp
 */
angular.module('rotApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      matchBrackets: true,
      indentWithTabs: true,
      tabMode: 'shift',
      mode: 'php',
      autofocus: true,
    };

    $scope.console = {
      output: 'Здесь будут отображаться результаты работы программы',
    };

    $scope.langs = [
      {
        name: "PHP",
        mode: "php",
        handler: function(input) {},
        sampleCode: '<?php\necho "Hello World";\n?>',
      },
      {
        name: "Java",
        mode: "text/x-java",
        handler: function(input) {

          var address = "http://localhost:8080/rot-java-webservice/services/JavaCodeEvaluator";

          $http.get(address).
            success(function(data) {
              console.log(data);
              $scope.console.output = data;
            });

        },
        sampleCode: 'System.out.println("Hello World");',
      },
      {
        name: "C++",
        mode: "text/x-c++src",
        handler: function(input) {},
        sampleCode: '// No sample code set for C++'
      },
    ];

    $scope.currentLang = "PHP";

    var setSampleCode = function() {
      for (var i = 0; i < $scope.langs.length; i++) {
        if ($scope.langs[i].name === $scope.currentLang) {
          $scope.code = $scope.langs[i].sampleCode;
          $scope.editorOptions.mode = $scope.langs[i].mode;
        }
      }
    }

    setSampleCode();

    $scope.setLang = function(langName) {
      $scope.currentLang = langName;
      setSampleCode();
    }

    $scope.run = function() {
      if ($scope.code === "") {
        $scope.console = "Невозможно запустить: нет кода";
      } else {
        for (var i = 0; i < $scope.langs.length; i++) {
          if ($scope.langs[i].name === $scope.currentLang) {
            $scope.langs[i].handler($scope.code);
          }
        }
      }
    }


  });
