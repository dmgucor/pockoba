(function() {
    'use strict';
  
    //check for support
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }
    console.log('This browser doesn\'t support IndexedDB');
    var dbPromise = idb.open('kobaDB', 1, function(upgradeDb) {
      console.log('making a new object store');
      if (!upgradeDb.objectStoreNames.contains('persona')) {
        upgradeDb.createObjectStore('persona');
      }
    });
  
  })();