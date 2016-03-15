var utils = function() {
  var module = {};

  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // cached queries
  var v = {};

  v.screenSizeReq = document.querySelector('#screen-size-req');
  v.compatReq = document.querySelector('#compat-req');
  v.mainContainer = document.querySelector('#main-container');
  v.pageLinks = document.querySelector('#page-links');

  function checkSVGSupport() {
    return 'SVGRect' in window;
    //return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
  }

  function checkScreenSizeRequirement() {
    var width, height, valid;

    width = window.innerWidth;
    height = window.innerHeight;

    valid = width - height > 460 && height > 500;

    if (valid) {
      v.screenSizeReq.classList.remove('visible');
      v.mainContainer.classList.remove('blur');
      v.pageLinks.classList.remove('invisible');
    } else {
      v.screenSizeReq.classList.add('visible');
      v.mainContainer.classList.add('blur');
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
    v.screenSizeReq.addEventListener('click', function() {
      v.screenSizeReq.classList.remove('visible');
      v.mainContainer.classList.remove('blur');
      v.pageLinks.classList.remove('invisible');
    }, false);

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
      checkScreenSizeRequirement();
      window.addEventListener('resize', checkScreenSizeRequirement, false);
      window.addEventListener('orientationchange', checkScreenSizeRequirement, false);
    }
  };

  return module;
}();
