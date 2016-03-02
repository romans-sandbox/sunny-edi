var utils = function() {
  var module = {};

  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  module.monthName = function(i) {
    return monthNames[i];
  };

  return module;
}();
