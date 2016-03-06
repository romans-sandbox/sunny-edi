var utils = function() {
  var module = {};

  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // cached queries
  var v = {};

  v.screenSizeReq = document.querySelector('#screen-size-req');
  v.compatReq = document.querySelector('#compat-req');

  function checkSVGSupport() {
    return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
  }

  function checkScreenSizeRequirement() {
    var width, height, widthHeightRatio, valid;

    width = window.innerWidth;
    height = window.innerHeight;
    widthHeightRatio = width / height;

    valid = height > 500 && width > 950 && widthHeightRatio > 1.75;

    if (valid) {
      v.screenSizeReq.classList.remove('visible');
    } else {
      v.screenSizeReq.classList.add('visible');
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
    if (!checkSVGSupport()) {
      v.compatReq.classList.add('visible');
    } else {
      checkScreenSizeRequirement();
      window.addEventListener('resize', checkScreenSizeRequirement, false);
      window.addEventListener('orientationchange', checkScreenSizeRequirement, false);
    }
  };

  return module;
}();
