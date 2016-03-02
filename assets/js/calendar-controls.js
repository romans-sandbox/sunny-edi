var calendarControls = function() {
  var module = {};

  // cached queries
  var v = {};

  var activeLocation, activeWeatherCondition;
  var locationButtons = {}, weatherConditionButtons = {};

  v.locationButtons = document.querySelectorAll('[data-location]');
  v.weatherConditionButtons = document.querySelectorAll('[data-weather]');

  function deactivateLocationControls() {
    var i;

    for (i = 0; i < v.locationButtons.length; i++) {
      v.locationButtons[i].classList.remove('active');
    }
  }

  function deactivateWeatherControls() {
    var i;

    for (i = 0; i < v.weatherConditionButtons.length; i++) {
      v.weatherConditionButtons[i].classList.remove('active');
    }
  }

  function setActiveLocation(location) {
    if (calendarChart.ready) {
      deactivateLocationControls();
      activeLocation = location;
      locationButtons[location].classList.add('active');
      calendarChart.update();
    }
  }

  function setActiveWeatherCondition(weatherCondition) {
    if (calendarChart.ready) {
      deactivateWeatherControls();
      activeWeatherCondition = weatherCondition;
      weatherConditionButtons[weatherCondition].classList.add('active');
      calendarChart.update();
    }
  }

  module.initLocationButtons = function() {
    var i, location;

    for (i = 0; i < v.locationButtons.length; i++) {
      location = v.locationButtons[i].getAttribute('data-location');

      locationButtons[location] = v.locationButtons[i];

      (function(location) {
        v.locationButtons[i].addEventListener('click', function() {
          setActiveLocation(location);
        }, false);
      })(location);
    }
  };

  module.initWeatherButtons = function() {
    var i, weatherCondition;

    for (i = 0; i < v.weatherConditionButtons.length; i++) {
      weatherCondition = v.weatherConditionButtons[i].getAttribute('data-weather');

      weatherConditionButtons[weatherCondition] = v.weatherConditionButtons[i];

      (function(weatherCondition) {
        v.weatherConditionButtons[i].addEventListener('click', function() {
          setActiveWeatherCondition(weatherCondition);
        }, false);
      })(weatherCondition);
    }
  };

  module.getActiveLocation = function() {
    return activeLocation;
  };

  module.setActiveLocation = setActiveLocation;

  module.getActiveWeatherCondition = function() {
    return activeWeatherCondition;
  };

  module.setActiveWeatherCondition = setActiveWeatherCondition;

  module.getStatus = function() {
    return {
      location: activeLocation,
      weatherCondition: activeWeatherCondition
    };
  };

  module.setStatus = function(location, weatherCondition) {
    if (calendarChart.ready) {
      deactivateLocationControls();
      activeLocation = location;
      locationButtons[location].classList.add('active');
      activeWeatherCondition = weatherCondition;
      weatherConditionButtons[weatherCondition].classList.add('active');
      calendarChart.update();
    }
  };

  return module;
}();
