'use strict';

/* jshint -W098 */
angular.module('mean.processus').controller('SchemaGlobalController', ['$scope', 'Global', 'Processus', '$state', '$rootScope', '$http',
  function($scope, Global, Processus, $state, $rootScope, $http) {
    $scope.global = Global;
    $scope.package = {
      name: 'processus'
    };

    $scope.init = function() {
      var associations = localStorage.getItem('associations') || [];
      $http.post('/api/finalSchema', {
        associations: localStorage.getItem('finalAssociations')
      }).success(function(results) {
        localStorage.setItem('schemas', JSON.stringify(results));
        $scope.schemas = results;
        console.log(results);
      });
    };


    $scope.migration = function() {
      // console.log($scope.associations);
      $state.go('configuration-migration-donnees');
    };
    $scope.back = function() {

    };
  }
]);
