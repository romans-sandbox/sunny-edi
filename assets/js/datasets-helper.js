var datasetsHelper = function() {
  var module = {};

  var options = {
    datasets: {
      edinburghWeather2011: {
        source: 'assets/data/edinburgh-weather-2011.csv',
        sourceType: 'csv',
        ready: false
      },
      edinburghWeather2012: {
        source: 'assets/data/edinburgh-weather-2012.csv',
        sourceType: 'csv',
        ready: false
      },
      edinburghWeather2013: {
        source: 'assets/data/edinburgh-weather-2013.csv',
        sourceType: 'csv',
        ready: false
      },
      edinburghWeather2014: {
        source: 'assets/data/edinburgh-weather-2014.csv',
        sourceType: 'csv',
        ready: false
      },
      edinburghWeather2015: {
        source: 'assets/data/edinburgh-weather-2015.csv',
        sourceType: 'csv',
        ready: false
      },
      madridWeather2011: {
        source: 'assets/data/madrid-weather-2011.csv',
        sourceType: 'csv',
        ready: false
      },
      madridWeather2012: {
        source: 'assets/data/madrid-weather-2012.csv',
        sourceType: 'csv',
        ready: false
      },
      madridWeather2013: {
        source: 'assets/data/madrid-weather-2013.csv',
        sourceType: 'csv',
        ready: false
      },
      madridWeather2014: {
        source: 'assets/data/madrid-weather-2014.csv',
        sourceType: 'csv',
        ready: false
      },
      madridWeather2015: {
        source: 'assets/data/madrid-weather-2015.csv',
        sourceType: 'csv',
        ready: false
      }
    }
  };

  var loadedDatasets = {};
  var readyAllCallbacks = [];

  function checkIfAllReadyAndFireCallbacks() {
    var datasetName, allReady = true, i;

    for (datasetName in options.datasets) {
      if (options.datasets.hasOwnProperty(datasetName)) {
        if (!options.datasets[datasetName].ready) {
          allReady = false;
          break;
        }
      }
    }

    if (allReady) {
      for (i = 0; i < readyAllCallbacks.length; i++) {
        readyAllCallbacks[i]();
      }
    }
  }

  module.readyAllCallback = function(callback) {
    if (typeof callback === 'function') {
      readyAllCallbacks.push(callback);
      return true;
    }

    return false;
  };

  module.loadAlDatasets = function() {
    var datasetName;

    for (datasetName in options.datasets) {
      if (options.datasets.hasOwnProperty(datasetName)) {
        (function(dataset, datasetName) {
          if (dataset.sourceType === 'csv') {
            d3.csv(
              dataset.source,
              function(error, rows) {
                if (error) {
                  throw error;
                }

                loadedDatasets[datasetName] = rows;

                options.datasets[datasetName].ready = true;

                checkIfAllReadyAndFireCallbacks();
              }
            );
          } else {
            console.error('Unknown dataset type `' + dataset.sourceType + '`.');
          }
        })(options.datasets[datasetName], datasetName);
      }
    }
  };

  module.data = loadedDatasets;

  return module;
}();
