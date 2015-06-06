'use strict';

/* jshint -W098 */
angular.module('mean.processus').controller('AssociationsController', ['$scope', 'Global', 'Processus', '$state', '$rootScope',
  function ($scope, Global, Processus, $state, $rootScope) {
    $scope.global = Global;
    $scope.package = {
      name: 'processus'
    };
    $scope.tables = [
      {
        name: "Client",
        columns: [
          { name: "ID" },
          { name: "Nom" },
          { name: "Prenom" }
        ]
      },
      {
        name: "Commande",
        columns: [
          { name: "ID" },
          { name: "Date" }
        ]
      },
      {
        name: "LigneCommande",
        columns: [
          { name: "ID" },
          { name: "Id_commande" },
          { name: "Prix" }
        ]
      },
      {
        name: "Facture",
        columns: [
          { name: "ID" },
          { name: "Id_commande" }
        ]
      },
      {
        name: "Chambre",
        columns: [
          { name: "ID" },
          { name: "Numero" },
          { name: "Etage" }
        ]
      },
      {
        name: "Adresse",
        columns: [
          { name: "ID" },
          { name: "Id_client" },
          { name: "Addresse1" },
          { name: "Addresse2" },
          { name: "Addresse3" }
        ]
      }];


    $scope.types = [
      {
        id: 1,
        label: "1 - 1"
      }, {
        id: 2,
        label: "1 - n"
      }, {
        id: 3,
        label: "n - 1"
      }, {
        id: 4,
        label: "n - n"
      }];

    

    $scope.drawable = {};
    $scope.associations = [];
    
    $scope.addAssociation = function () {
      var association = {
        first: angular.copy($scope.table1),
        type: $scope.type,
        second: angular.copy($scope.table2)
      };
      $scope.associations.push(association);
      $scope.table1 = {};
      $scope.table2 = {};
      $scope.type = {};
    };

    $scope.selectKey = function (col) {
      col.selected = !col.selected;
    };
  
    $scope.schemas = function () {
      $state.go('configuration-choix-des-schemas');
    };
    $scope.back = function () {

    };
  }
]);
