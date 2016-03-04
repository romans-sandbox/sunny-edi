var calendarControls = function() {
  var module = {};

  // cached queries
  var v = {};

  var activeLocation, activeYear, activeWeatherCondition;
  var locationButtons = {}, yearButtons = {}, weatherConditionButtons = {};

  v.locationButtons = document.querySelectorAll('[data-location]');
  v.yearButtons = document.querySelectorAll('[data-year]');
  v.weatherConditionButtons = document.querySelectorAll('[data-weather]');
  v.weatherConditionIcons = document.querySelectorAll('[data-weather-icon]');
  v.fullscreenLink = document.querySelector('#fullscreen');

  function deactivateLocationControls() {
    var i;

    for (i = 0; i < v.locationButtons.length; i++) {
      v.locationButtons[i].classList.remove('active');
    }
  }

  function deactivateYearControls() {
    var i;

    for (i = 0; i < v.yearButtons.length; i++) {
      v.yearButtons[i].classList.remove('active');
    }
  }

  function deactivateWeatherConditionControls() {
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

  function setActiveYear(year) {
    if (calendarChart.ready) {
      deactivateYearControls();
      activeYear = year;
      yearButtons[year].classList.add('active');
      calendarChart.update();
    }
  }

  function setActiveWeatherCondition(weatherCondition) {
    if (calendarChart.ready) {
      deactivateWeatherConditionControls();
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

  module.initYearButtons = function() {
    var i, year;

    for (i = 0; i < v.yearButtons.length; i++) {
      year = v.yearButtons[i].getAttribute('data-year');

      yearButtons[year] = v.yearButtons[i];

      (function(year) {
        v.yearButtons[i].addEventListener('click', function() {
          setActiveYear(year);
        }, false);
      })(year);
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

  module.initWeatherIcons = function() {
    var i, icon;

    for (i = 0; i < v.weatherConditionIcons.length; i++) {
      (function(container, icon) {
        d3.xml(
          paths.svg + '/' + icon + '.svg',
          'image/svg+xml',
          function(error, xml) {
            if (error) {
              throw error;
            }

            container.appendChild(xml.documentElement);
          }
        );
      })(
        v.weatherConditionIcons[i],
        v.weatherConditionIcons[i].getAttribute('data-weather-icon')
      );
    }
  };

  module.initFullscreenLink = function() {
    v.fullscreenLink.addEventListener('click', function() {
      var f, fOut, on;

      on = document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      f =
        document.documentElement.requestFullscreen ||
        document.documentElement.mozRequestFullScreen ||
        document.documentElement.msRequestFullscreen ||
        document.documentElement.webkitRequestFullscreen;

      fOut =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen ||
        document.webkitExitFullscreen;

      if (on) {
        if (typeof fOut === 'function') {
          fOut.call(document);
        }
      } else {
        if (typeof f === 'function') {
          f.call(document.documentElement);
        }
      }
    }, false);
  };

  module.getActiveLocation = function() {
    return activeLocation;
  };

  module.setActiveLocation = setActiveLocation;

  module.getActiveYear = function() {
    return activeYear;
  };

  module.setActiveYear = setActiveYear;

  module.getActiveWeatherCondition = function() {
    return activeWeatherCondition;
  };

  module.setActiveWeatherCondition = setActiveWeatherCondition;

  module.getStatus = function() {
    return {
      location: activeLocation,
      year: activeYear,
      weatherCondition: activeWeatherCondition
    };
  };

  module.setStatus = function(location, year, weatherCondition) {
    if (calendarChart.ready) {
      deactivateLocationControls();
      deactivateYearControls();
      deactivateWeatherConditionControls();
      activeLocation = location;
      activeYear = year;
      activeWeatherCondition = weatherCondition;
      locationButtons[location].classList.add('active');
      yearButtons[year].classList.add('active');
      weatherConditionButtons[weatherCondition].classList.add('active');
      calendarChart.update();
    }
  };

  return module;
}();
