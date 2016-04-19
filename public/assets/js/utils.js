var utils = function() {
  var module = {};

  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // cached queries
  var v = {};

  v.compatReq = document.querySelector('#compat-req');
  v.mainContainer = document.querySelector('#main-container');
  v.pageLinks = document.querySelector('#page-links');

  function checkSVGSupport() {
    return 'SVGRect' in window;
    //return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
  }

  function adaptContent() {
    var width, height, desktop;

    width = window.innerWidth;
    height = window.innerHeight;

    desktop = width - height > 460 && height > 500;

    if (desktop) {
      v.mainContainer.classList.remove('mobile');
      v.pageLinks.classList.remove('invisible');
    } else {
      v.mainContainer.classList.add('mobile');
      v.pageLinks.classList.add('invisible');
    }
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
    } else {
      adaptContent();
      window.addEventListener('resize', adaptContent, false);
      window.addEventListener('orientationchange', adaptContent, false);
    }
  };

  module.setWeatherConditionLabel = function(weatherCondition) {
    v.mainContainer.classList.remove('sunny', 'rainy', 'windy');
    v.mainContainer.classList.add(weatherCondition);
  };

  return module;
}();
