'use strict';

/* jshint -W098 */
angular.module('mean.processus').controller('MySQLController', ['$scope', '$http', 'Global', 'Processus', '$state',
  function ($scope, $http, Global, Processus, $state) {
    $scope.global = Global;
    $scope.package = {
      name: 'processus'
    };

    $scope.mysql = function () {
      var host = this.host || 'http://localhost/',
        port = this.port || 3306,
        user = this.user || 'root',
        password = this.password,
        database = this.dbName,
        connection = { host: host, port: port, user: user, password: password, database: database };

      $http.get('/api/connectmysql', { params: { connection: connection } }).success(function (tables) {
        localStorage.setItem('connection', JSON.stringify(connection));
        localStorage.setItem('tables', JSON.stringify(tables));
        $state.go('configuration-mongodb');
      }).error(function (params) {
        // TODO
      });


    };

    $scope.mongodb = function () {

      $state.go('configuration-identification-associations');
    };

    $scope.back = function () {

    };
  }
]);
