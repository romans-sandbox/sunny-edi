var calendarControls = function() {
  var module = {};

  // cached queries
  var v = {};

  var activeWeather = 'sunny';

  v.locationEdinburghButton = document.querySelector('[data-location="edinburgh"]');
  v.locationMadridButton = document.querySelector('[data-location="madrid"]');
  v.weatherSunnyButton = document.querySelector('[data-weather="sunny"]');
  v.weatherRainyButton = document.querySelector('[data-weather="rainy"]');
  v.weatherWindyButton = document.querySelector('[data-weather="windy"]');

  function deactivateLocation() {
    v.locationEdinburghButton.classList.remove('active');
    v.locationMadridButton.classList.remove('active');
  }

  function deactivateWeather() {
    v.weatherSunnyButton.classList.remove('active');
    v.weatherRainyButton.classList.remove('active');
    v.weatherWindyButton.classList.remove('active');
  }

  module.initLocationButtons = function() {
    v.locationEdinburghButton.addEventListener('click', function() {
      if (calendarChart.ready) {
        deactivateLocation();
        v.locationEdinburghButton.classList.add('active');
        calendarChart.setLocationEdinburgh();
      }
    }, false);

    v.locationMadridButton.addEventListener('click', function() {
      if (calendarChart.ready) {
        deactivateLocation();
        v.locationMadridButton.classList.add('active');
        calendarChart.setLocationMadrid();
      }
    }, false);

    v.locationEdinburghButton.classList.add('active');
  };

  module.initWeatherButtons = function() {
    v.weatherSunnyButton.addEventListener('click', function() {
      if (calendarChart.ready) {
        deactivateWeather();
        activeWeather = 'sunny';
        v.weatherSunnyButton.classList.add('active');
        calendarChart.setWeatherSunny();
      }
    }, false);

    v.weatherRainyButton.addEventListener('click', function() {
      if (calendarChart.ready) {
        deactivateWeather();
        activeWeather = 'rainy';
        v.weatherRainyButton.classList.add('active');
        calendarChart.setWeatherRainy();
      }
    }, false);

    v.weatherWindyButton.addEventListener('click', function() {
      alert('under development');

      /*if (calendarChart.ready) {
       deactivateWeather();
       v.weatherWindyButton.classList.add('active');
       // calendarChart.setWeatherWindy();
       }*/
    }, false);

    v.weatherSunnyButton.classList.add('active');
  };

  module.getActiveWeather = function() {
    return activeWeather;
  };

  return module;
}();
