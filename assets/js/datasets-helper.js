var datasetsHelper = function() {
  var module = {};

  var options = {
    datasets: {
      edinburghWeather: {
        source: 'assets/data/edinburgh-weather-2015.csv',
        sourceType: 'csv',
        ready: false
      },
      madridWeather: {
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
