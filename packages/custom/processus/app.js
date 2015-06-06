'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Processus = new Module('processus');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Processus.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Processus.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Processus.menus.add({
    title: 'processus example page',
    link: 'processus example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Processus.aggregateAsset('css', 'processus.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Processus.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Processus.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Processus.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Processus;
});
