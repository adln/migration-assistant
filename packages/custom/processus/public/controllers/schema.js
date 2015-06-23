'use strict';

/* jshint -W098 */
angular.module('mean.processus').controller('SchemaController', ['$scope', 'Global', 'Processus', '$state', '$rootScope', '$http',
  function($scope, Global, Processus, $state, $rootScope, $http) {
    $scope.global = Global;
    $scope.package = {
      name: 'processus'
    };

    /*
    $scope.associations = [{
      "tables": [{
        "name": "employees",
        "schema": [{
          "titles": {
            "title": "Number",
            "from_date": "Number",
            "to_date": "Number"
          },
          "birth_date": "Date",
          "first_name": "String",
          "last_name": "String",
          "gender": "Array",
          "hire_date": "Date"
        }, null],
        "request": "SELECT * FROM employees LEFT OUTER JOIN titles ON employees.emp_no = titles.emp_no;"
      }, {
        "name": "titles",
        "schema": [{
          "employees": {
            "birth_date": "Number",
            "first_name": "Number",
            "last_name": "Number",
            "gender": "Number",
            "hire_date": "Number"
          },
          "title": "String",
          "from_date": "Date",
          "to_date": "Date"
        }, null],
        "request": ""
      }]
    }, {
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
    */
    $scope.init = function() {
      var associations = localStorage.getItem('associations');
      $http.post('/api/schemas', {
        associations: associations
      }).success(function(results) {
        $scope.associations = results;
      });
    };


    $scope.migration = function() {
      localStorage.setItem('finalAssociations', JSON.stringify($scope.associations));
      

      // console.log($scope.associations);
      $state.go('configuration-schema-global');
    };
    $scope.selectTable = function(table, schema) {
      for (var i = 0, length = table.schema.length; i < length; i++) {
        if(table.schema[i] !== null) delete table.schema[i].selected;
        else delete table.selectednull;
      }
      if(schema !== null) schema.selected = true;
      else table.selectednull = true;
    };
  }
]);
