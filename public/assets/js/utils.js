var utils = function() {
  var module = {};

  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // cached queries
  var v = {};

  v.compatReq = document.querySelector('#compat-req');
  v.mainContainer = document.querySelector('#main-container');
  v.pageLinks = document.querySelector('#page-links');
  v.calendarContainer = document.querySelector('#calendar-container');
  v.contentContainer = document.querySelector('#content-container');
  
  var pastIsDesktop;

  function checkSVGSupport() {
    return 'SVGRect' in window;
    //return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
  }

  function adaptContent(changeCallback) {
    var width, height, isDesktop;

    width = window.innerWidth;
    height = window.innerHeight;

    isDesktop = width - height > 460 && height > 500;

    if (isDesktop) {
      v.mainContainer.classList.remove('mobile');

      if (!v.calendarContainer.classList.contains('middle')) {
        v.pageLinks.classList.remove('invisible');
      }
    } else {
      v.mainContainer.classList.add('mobile');
      v.pageLinks.classList.add('invisible');
    }

    if (pastIsDesktop !== isDesktop) {
      changeCallback(isDesktop);
    }

    pastIsDesktop = isDesktop;
  }

  module.monthName = function(i) {
    return monthNames[i];
  };

  // https://stackoverflow.com/questions/563406/add-days-to-datetime
  module.addDaysToDate = function(date, days) {
    var result;

    result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
  };

  module.checkRequirements = function() {
    v.compatReq.addEventListener('click', function() {
      v.compatReq.classList.remove('visible');
      v.mainContainer.classList.remove('blur');
      v.pageLinks.classList.remove('invisible');
    }, false);

    if (!checkSVGSupport()) {
      v.compatReq.classList.add('visible');
      v.mainContainer.classList.add('blur');
      v.pageLinks.classList.add('invisible');
    }
  };

  module.initAdaptContentEvents = function(changeCallback) {
    adaptContent(changeCallback);
    window.addEventListener('resize', function() {
      adaptContent(changeCallback);
    }, false);
    window.addEventListener('orientationchange', function() {
      adaptContent(changeCallback);
    }, false);
  };

  module.setWeatherConditionLabel = function(weatherCondition) {
    v.mainContainer.classList.remove('sunny', 'rainy', 'windy');
    v.mainContainer.classList.add(weatherCondition);
  };

  module.middleCalendar = function(yes) {
    if (yes) {
      v.calendarContainer.classList.add('middle');
      v.pageLinks.classList.add('invisible');
      v.contentContainer.classList.add('invisible');
    } else {
      v.calendarContainer.classList.remove('middle');
      v.pageLinks.classList.remove('invisible');
      v.contentContainer.classList.remove('invisible');
    }
  };

  return module;
}();
