'use strict';

/* jshint -W098 */
angular.module('mean.processus').controller('MySQLController', ['$scope', '$http', 'Global', 'Processus', '$state',
  function ($scope, $http, Global, Processus, $state) {
    $scope.global = Global;
    $scope.package = {
      name: 'processus'
    };

    $scope.mysql = function (isValid) {

      if (isValid) {
        var host = this.host,
          port = this.port,
          user = this.user,
          password = this.password,
          database = this.dbName,
          connection = { host: host, port: port, user: user, password: password, database: database };

        $http.get('/api/connectmysql', { params: { connection: connection } }).success(function (tables) {
          localStorage.setItem('connection', JSON.stringify(connection));
          localStorage.setItem('tables', JSON.stringify(tables));
          $state.go('configuration-mongodb');
        }).error(function (errors) {
          $scope.error = true;
          console.log(errors);
        });
      } else {
        console.log(isValid);
        console.log('nin');
        $scope.submitted = true;
      }

    };

    $scope.mongodb = function () {

      $state.go('configuration-identification-associations');
    };

    $scope.back = function () {

    };
  }
]);
