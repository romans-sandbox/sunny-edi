var calendarControls = function() {
  var module = {};

  // cached queries
  var v = {};

  var activeLocation, activeYear, activeWeatherCondition;
  var locationButtons = {}, yearButtons = {}, weatherConditionButtons = {}, weatherConditionIcons = {};

  v.locationButtons = document.querySelectorAll('[data-location]');
  v.yearButtons = document.querySelectorAll('[data-year]');
  v.weatherConditionButtons = document.querySelectorAll('[data-weather]');
  v.weatherConditionIcons = document.querySelectorAll('[data-weather-icon]');
  v.fullscreenLink = document.querySelector('#fullscreen');
  v.creditsLink = document.querySelector('#credits');
  v.joystick = document.querySelector('#joystick');
  v.syncNumberContainer = document.querySelector('#sync-number-container');

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
      v.weatherConditionIcons[i].classList.remove('active');
    }
  }

  function setActiveLocation(location) {
    if (calendarChart.ready) {
      deactivateLocationControls();
      activeLocation = location;
      locationButtons[location].classList.add('active');
      calendarChart.update();
      sync.emitStatus();
    }
  }

  function setActiveYear(year) {
    if (calendarChart.ready) {
      deactivateYearControls();
      activeYear = year;
      yearButtons[year].classList.add('active');
      calendarChart.update();
      sync.emitStatus();
    }
  }

  function setActiveWeatherCondition(weatherCondition) {
    if (calendarChart.ready) {
      deactivateWeatherConditionControls();
      activeWeatherCondition = weatherCondition;
      weatherConditionButtons[weatherCondition].classList.add('active');
      weatherConditionIcons[weatherCondition].classList.add('active');
      calendarChart.update();
      sync.emitStatus();
    }
  }

  function computeRad(ev) {
    var box, rad;

    box = v.joystick.getBoundingClientRect();

    rad = Math.atan2(
      -(box.left - ev.pageX + box.width / 2),
      box.top - ev.pageY + box.height / 2
    );

    return rad;
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
    var i, icon, weatherCondition;

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

            weatherCondition = container.getAttribute('data-weather-icon');

            weatherConditionIcons[weatherCondition] = container;

            if (activeWeatherCondition === weatherCondition) {
              container.classList.add('active');
            }
          }
        );
      })(
        v.weatherConditionIcons[i],
        v.weatherConditionIcons[i].getAttribute('data-weather-icon')
      );
    }
  };

  module.initFullscreenLink = function() {
    v.fullscreenLink.addEventListener('click', function(ev) {
      var f, fOut, on;

      ev.preventDefault();

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
          v.fullscreenLink.innerHTML = 'Go Fullscreen';
        }
      } else {
        if (typeof f === 'function') {
          f.call(document.documentElement);
          v.fullscreenLink.innerHTML = 'Exit Fullscreen';
        }
      }
    }, false);
  };

  module.initCreditsLink = function() {
    v.creditsLink.addEventListener('click', function(ev) {
      ev.preventDefault();

      window.alert('Weather data provided by World Weather Online.\nWeather icons freely distributed via ' +
        'Flaticon and designed by Freepik.\n\nExperience developed by NULLMIGHTY.');
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
      weatherCondition in weatherConditionIcons && weatherConditionIcons[weatherCondition].classList.add('active');
      calendarChart.update();
    }
  };

  module.initJoystick = function() {
    var tracking = false;

    v.joystick.addEventListener('mousedown', function(ev) {
      tracking = true;

      sync.emitShow();
      sync.emitRad(computeRad(ev));

      ev.preventDefault();
    }, false);

    v.joystick.addEventListener('touchstart', function(ev) {
      tracking = true;

      if (ev.changedTouches && ev.changedTouches.length > 0) {
        sync.emitShow();
        sync.emitRad(computeRad(ev.changedTouches[0]));
      }

      ev.preventDefault();
    }, false);

    document.addEventListener('mouseup', function() {
      tracking = false;
      sync.emitHide();
    }, false);

    document.addEventListener('touchend', function() {
      tracking = false;
      sync.emitHide();
    }, false);

    document.addEventListener('mousemove', function(ev) {
      if (tracking) {
        sync.emitRad(computeRad(ev));

        ev.preventDefault();
      }
    }, false);

    document.addEventListener('touchmove', function(ev) {
      if (tracking) {
        if (ev.changedTouches && ev.changedTouches.length > 0) {
          sync.emitRad(computeRad(ev.changedTouches[0]));
        }

        ev.preventDefault();
      }
    }, false);
  };

  module.syncNumberContainer = function(visible) {
    if (visible) {
      v.syncNumberContainer.classList.add('visible');
    } else {
      v.syncNumberContainer.classList.remove('visible');
    }
  };

  module.syncNumberContainerSynced = function(synced) {
    if (synced) {
      v.syncNumberContainer.classList.add('synced');
    } else {
      v.syncNumberContainer.classList.remove('synced');
    }
  };

  return module;
}();
