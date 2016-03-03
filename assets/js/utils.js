var utils = function() {
  var module = {};

  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

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

  return module;
}();
