'use strict';

/* jshint -W098 */
angular.module('mean.processus').controller('MigrationController', ['$scope', 'Global', 'Processus', '$state', '$http', '$q',
  function($scope, Global, Processus, $state, $http, $q) {
    $scope.global = Global;
    $scope.package = {
      name: 'migration'
    };

    $scope.migrate = function() {
      var schemas = JSON.parse(localStorage.getItem('schemas'));
      console.log();
      $scope.logs = [];

      var promise = $q.all(null);
      angular.forEach(schemas, function(schema) {
        
        promise = promise.then(function() {
          $scope.logs.push('Debut de migration pour ' + schema.name);
          return $http.post('/api/migration', {
            schema: JSON.stringify(schema)
          }).then(function(results) {

            $scope.logs.push('Fin de migration pour ' + schema.name);

          });
        });

      });

    };
  }
]);
