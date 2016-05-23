'use strict';

/**
 * @ngdoc function
 * @name rotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rotApp
 */
angular.module('rotApp')
  .controller('MainCtrl', function ($scope, $http, $soap) {

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      matchBrackets: true,
      indentWithTabs: true,
      tabMode: 'shift',
      autofocus: true,
    };

    $scope.console = {
      output: 'Здесь будут отображаться результаты работы программы',
    };

    $scope.langs = [
      {
        name: "PHP",
        mode: "php",
        handler: function(input) {

          var url = "RESTful URL";
          var action = "check";

          $http.get(url).then(function(response) {
            console.log(response);
          });

        },
        sampleCode: '<?php\necho "Hello World";\n?>',
      },
      {
        name: "Java",
        mode: "text/x-java",
        handler: function(input) {

          var url = "http://localhost:8080/rot-java-webservice/services/JavaCodeEvaluator?wsdl";
          var action = "evaluateCode";
          var params = {"code": $scope.code};

          $soap.post(url, action, params).then(function(response) {
            console.log(response);
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

    $scope.currentLang = "Java";

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
