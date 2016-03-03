datasetsHelper.loadAlDatasets();

datasetsHelper.readyAllCallback(function() {
  calendarChart.init();
  calendarWeekChart.init();
  calendarControls.initLocationButtons();
  calendarControls.initYearButtons();
  calendarControls.initWeatherButtons();
  calendarControls.setStatus('edinburgh', '2015', 'sunny');
});
