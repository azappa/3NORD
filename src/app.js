/**
 *   3NORD.js for Pebble
 **/

var UI = require('ui');
var ajax = require('ajax');
var _ = require('lodash.js');
var moment = require('moment.js');
var URL = 'http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/01318/01511/' + moment().format();
console.log('>> Search URL is >> : ', URL);

var main = new UI.Card({
  title: '3NORD.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Trova il tuo treno!',
  body: 'Caricamento dati...'
});

main.show();


var results = new UI.Menu({
  sections: [{
    title: 'Primi 10 risultati',
    items: []
  }]
});

var parseResults = function (results) {
  return _.map(results, function (r) {
    //console.log(JSON.stringify(r, null, 2));
    return {
      subtitle: 'Durata viaggio: ' + r.durata,
      title: _.trunc(r.vehicles[0].origine, 8) + ' > ' + 
              _.trunc(r.vehicles[r.vehicles.length - 1].destinazione, 8) + 
              ' (' + (r.vehicles.length - 1) + ' cambi)'
    };
  });
};

var getResults = function (url) {
  // Make the request
  ajax(
    {
      url: url,
      type: 'json'
    },
    function(data) {
      //console.log('got data!');
      
      if (data.soluzioni && data.soluzioni.length > 0) {
        results.items(0, parseResults(_.slice(data.soluzioni, 0, 10)));
        results.show();
        main.hide();
      } else {
        main.subtitle('Ooops!');
        main.body('Nessuna soluzione trovata.');
      }
  
    },
    function(error) {
      main.subtitle('Errore');
      main.body('Info: ', JSON.stringify(error));
    }
  );
};

getResults(URL);
