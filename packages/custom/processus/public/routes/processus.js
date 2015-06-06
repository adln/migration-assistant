'use strict';

angular.module('mean.processus').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('configuration-mysql', {
      url: '/configuration-mysql',
      templateUrl: 'processus/views/configuration-mysql.html'
    });
    $stateProvider.state('configuration-mongodb', {
      url: '/configuration-mongodb',
      templateUrl: 'processus/views/configuration-mongodb.html'
    });
    $stateProvider.state('configuration-identification-associations', {
      url: '/configuration-identification-associations',
      templateUrl: 'processus/views/configuration-identification-associations.html'
    });
    $stateProvider.state('configuration-choix-des-schemas', {
      url: '/configuration-choix-des-schemas',
      templateUrl: 'processus/views/configuration-choix-des-schemas.html'
    }); 
    $stateProvider.state('configuration-migration-donnees', {
      url: '/configuration-migration-donnees',
      templateUrl: 'processus/views/configuration-migration-donnees.html'
    });
  }
]);
