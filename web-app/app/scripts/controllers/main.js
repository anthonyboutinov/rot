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
      class: '',
    };

    $scope.langs = [
      {
        name: "PHP",
        mode: "php",
        handler: function(code) {

          var params = {code: code};
          var encodedParams = "{%22code%22:%22" + encodeURIComponent(code) + "%22}";
          var baseUrl = "http://localhost/";
          var appendixUrl = "?apiRequest.APIWithParams=" + encodedParams;
          var compositeUrl = baseUrl + appendixUrl;

          console.log(compositeUrl);
          $http.get(compositeUrl).then(function(response) {
            // console.log(response.data);
            if (response.data.error) {
              $scope.console.class = "error";
              $scope.console.output = response.data.error;
            } else {
              if (response.data.response.retParameter === null) {
                $scope.console.output = "undefined";
                $scope.console.class  = "error";
              } else {
                console.log(response.data.response.retParameter);
                $scope.console.output = response.data.response.retParameter;
                $scope.console.class  = "";
              }

            }
          });

        },
        sampleCode: 'echo 3;',
      },
      {
        name: "Java",
        mode: "text/x-java",
        handler: function(code) {

          var url = "http://localhost:8080/RESTJavaCodeEvaluator/b/evaluatorservice/eval";
          var params = {code: code};

          $http.post(url, params).then(function(response) {
            if (response.data.result) {
              $scope.console.output = response.data.result;
              $scope.console.class  = "";
            } else if (response.data.exception) {
              $scope.console.output = response.data.exception;
              $scope.console.class  = "error";
            } else {
              $scope.console.output = "undefined";
              $scope.console.class  = "error";
            }
          });

        },
        sampleCode: 'System.out.println("Hello World");',
      },
      {
        name: "C++",
        mode: "text/x-c++src",
        handler: function(code) {},
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
        $scope.console.class = "error";
        $scope.console.output = "Невозможно запустить: нет кода";
      } else {
        for (var i = 0; i < $scope.langs.length; i++) {
          if ($scope.langs[i].name === $scope.currentLang) {
            $scope.langs[i].handler($scope.code);
          }
        }
      }
    }


  });
