'use strict';

/* jshint -W098 */
angular.module('mean.processus').controller('SchemaController', ['$scope', 'Global', 'Processus', '$state', '$rootScope',
  function($scope, Global, Processus, $state, $rootScope) {
    $scope.global = Global;
    $scope.package = {
      name: 'processus'
    };

    $scope.associations = [{
      "tables": [{
        "name": "dept_emp",
        "schema": [{
          "dept_manager": {
            "dept_no": "char(4)",
            "emp_no": "int(11)",
            "from_date": "date",
            "to_date": "date"
          },
          "dept_no": "char(4)",
          "from_date": "date",
          "to_date": "date"
        }, null]
      }, {
        "name": "dept_manager",
        "schema": [{
          "dept_no": "char(4)",
          "dept_emp": {
            "emp_no": "int(11)",
            "dept_no": "char(4)",
            "from_date": "date",
            "to_date": "date"
          },
          "from_date": "date",
          "to_date": "date"
        }, null]
      }]
    }, {
      tables: [{
        name: "Client",
        schema: [{
          Id: "ObjectId",
          Nom: "String",
          Prenom: "String",
          addresse: {
            Addresse1: "String",
            Addresse2: "String",
            Addresse3: "String"
          }
        }, {
          Id: "ObjectId",
          Nom: "String",
          Prenom: "String",
        }]
      }, {
        name: "Adresse",
        schema: [{
          Id: "ObjectId",
          Client: "ObjectId",
          Addresse1: "String",
          Addresse2: "String",
          Addresse3: "String"
        }, null]
      }]
    }, {

      tables: [{
        name: "Commande",
        schema: [{
          Id: "ObjectId",
          Date: "Date",
          LigneCommande: [{
            Id: "ObjectId",
            Prix: "String"
          }]
        }, {
          Id: "ObjectId",
          Date: "Date",
        }]
      }, {
        name: "LigneCommande",
        schema: [{
          Id: "ObjectId",
          Commande: "ObjectId",
          Prix: "String"
        }, null]
      }]

    }];




    $scope.migration = function() {
      $state.go('configuration-migration-donnees');
    };
    $scope.back = function() {

    };
  }
]);
