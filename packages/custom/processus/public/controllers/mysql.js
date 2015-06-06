'use strict';

/* jshint -W098 */
angular.module('mean.processus').controller('MySQLController', ['$scope', 'Global', 'Processus', '$state',
  function ($scope, Global, Processus, $state) {
    $scope.global = Global;
    $scope.package = {
      name: 'processus'
    };

    $scope.mysql = function () {
      $state.go('configuration-mongodb');
    };
    
    $scope.mongodb = function () {
      $state.go('configuration-identification-associations');
    };
    
    $scope.back = function () {
      
    };
  }
]);
