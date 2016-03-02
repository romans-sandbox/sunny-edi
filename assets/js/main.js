datasetsHelper.loadAlDatasets();

datasetsHelper.readyAllCallback(function() {
  calendarChart.init();
  calendarControls.initLocationButtons();
  calendarControls.initWeatherButtons();
  calendarControls.setStatus('edinburgh', 'sunny');
});
