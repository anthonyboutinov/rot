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



    var phpServerHandler = function(codeType, code) {

      var params = {
        codeType: codeType,
        code: code.replace(/\n/g, " ")
      };

      var encodedParams = encodeURIComponent(JSON.stringify(params));

      var baseUrl = "http://localhost/";
      var appendixUrl = "?apiRequest.APIWithParams=";
      var compositeUrl = baseUrl + appendixUrl + encodedParams;

      console.log(compositeUrl);
      $http.get(compositeUrl).then(function(response) {

        console.log(response.data);
        if (response.data.error) {
          $scope.console.class = "error";
          $scope.console.output = response.data.error;
        } else if (response.data.response.retParameter === "Ошибка в SQL запросе:  ") {
            $scope.console.class = "error";
            $scope.console.output = response.data.response.retParameter;
        }
        else if (response.data.response.retParameter === null) {
          $scope.console.output = "undefined";
          $scope.console.class  = "error";
        } else {
          console.log(response.data.response.retParameter);
          $scope.console.output = response.data.response.retParameter;
          $scope.console.class  = "";
        }
      });

    };

    $scope.langs = [
      {
        name: "PHP",
        mode: "text/x-php",
        handler: function(code) {
          phpServerHandler("PHP", code);
        },
        sampleCode: 'echo 3;',
      },
      {
        name: "MySQL",
        mode: "text/x-mysql",
        handler: function(code) {
          phpServerHandler("SQL", code);
        },
        sampleCode: 'select \'Hello World!\'\nfrom dual;',
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
        sampleCode: 'int value = 3 + 5;\n\
 \n\
String compositeString = "Hello" + " there, " + value + "!";\n\
\n\
public class Me { \n\
  public String u; \n\
  public Me(String u) { \n\
   this.u = u; \n\
 } \n\
} \n\
 \n\
Me me = new Me(compositeString); \n\
 \n\
return me.u;',
      }

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
