'use strict';

/**
 * @ngdoc function
 * @name rotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rotApp
 */
angular.module('rotApp')
  .controller('MainCtrl', function ($scope, $http, $sce) {

    $scope.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      matchBrackets: true,
      indentWithTabs: true,
      tabMode: 'shift',
      autofocus: true,
    };

    $scope.console = {
      output: $sce.trustAsHtml('Здесь будут отображаться результаты работы программы'),
      class: '',
    };

    var setConsole = function(output) {
      console.log(output);
      $scope.console.output = $sce.trustAsHtml(output);
      $scope.console.class = '';
    }

    var setConsoleError = function(output) {
      console.log(output);
      $scope.console.output = $sce.trustAsHtml(output);
      $scope.console.class = 'error';
    }

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

        var sqlErrorMsg = "Ошибка в SQL запросе:";

        console.log(response.data);
        if (response.data.error) {
          // PHP error msg
          console.log('PHP error msg');
          setConsoleError(response.data.error);
        }
        else if (Array.isArray(response.data.response.retParameter)) {
          // SQL result
          console.log('SQL result');
          console.log(response.data.response.retParameter);
          var retParameter = response.data.response.retParameter;
          var out = '';
          for (var i = 0; i < retParameter.length; i++) {
            out += JSON.stringify(retParameter[i]) + '<br>';
          }
          setConsole(out);
        }
        else if (response.data.response.retParameter.substr(0, sqlErrorMsg.length) === sqlErrorMsg) {
          // SQL error msg
          console.log('SQL error msg');
          setConsoleError(response.data.response.retParameter);
        }
        else if (response.data.response.retParameter === null) {
          // PHP null result
          console.log('PHP null result');
          setConsoleError("undefined");
        }
        else {
          // PHP result
          console.log('PHP result');
          setConsole(response.data.response.retParameter)
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
        sampleCode: 'select\n\n  value as `value`,\n\n    (select\n      avg(value)\n   from sample\n   ) as avg,\n\n      (select\n      max(value)\n   from sample\n   ) as max,\n\n   (select\n      min(value)\n   from sample\n   ) as min\n\nfrom sample;',
      },
      {
        name: "Java",
        mode: "text/x-java",
        handler: function(code) {

          var url = "http://localhost:8080/RESTJavaCodeEvaluator/b/evaluatorservice/eval";
          var params = {code: code};

          $http.post(url, params).then(function(response) {
            if (response.data.result) {
              setConsole(response.data.result);
            } else if (response.data.exception) {
              setConsoleError(response.data.exception);
            } else {
              setConsoleError('undefined');
            }
          },
          function(response) {
            setConsoleError('Failed to load resource: Could not connect to the server.');
          });

        },
        sampleCode: 'int value = 3 + 5;\n\nString compositeString = "Hello" + " there, " + value + "!";\n\npublic class Me {\n  public String u;\n  public Me(String u) {\n   this.u = u;\n }\n} \n\nMe me = new Me(compositeString); \n\nreturn me.u;',
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
