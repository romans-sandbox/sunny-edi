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

  if (location.search === '?mawsynram-enabled') {
    Object.assign(options.datasets, {
      mawsynramWeather2011: {
        source: 'assets/data/mawsynram-weather-2011.csv',
        sourceType: 'csv',
        ready: false
      },
      mawsynramWeather2012: {
        source: 'assets/data/mawsynram-weather-2012.csv',
        sourceType: 'csv',
        ready: false
      },
      mawsynramWeather2013: {
        source: 'assets/data/mawsynram-weather-2013.csv',
        sourceType: 'csv',
        ready: false
      },
      mawsynramWeather2014: {
        source: 'assets/data/mawsynram-weather-2014.csv',
        sourceType: 'csv',
        ready: false
      },
      mawsynramWeather2015: {
        source: 'assets/data/mawsynram-weather-2015.csv',
        sourceType: 'csv',
        ready: false
      }
    });

    document.querySelector("#mawsynram").classList.remove('invisible');
    document.querySelector('#enable-m').href = '.';
    document.querySelector('#enable-m').innerHTML = 'Disable Mawsynram';
  }

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

  module.findMinMaxTempAllLocations = function() {
    var min = Infinity, minTest, max = -Infinity, maxTest, weatherDataKey;

    for (weatherDataKey in loadedDatasets) {
      if (loadedDatasets.hasOwnProperty(weatherDataKey)) {
        minTest = d3.min(loadedDatasets[weatherDataKey], function(d, i) {
          return +d.min_temp;
        });

        if (minTest < min) {
          min = minTest;
        }

        maxTest = d3.max(loadedDatasets[weatherDataKey], function(d, i) {
          return +d.max_temp;
        });

        if (maxTest > max) {
          max = maxTest;
        }
      }
    }

    return {
      min: min,
      max: max
    };
  };

  module.data = loadedDatasets;

  return module;
}();
