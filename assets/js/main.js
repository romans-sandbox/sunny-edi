datasetsHelper.loadAlDatasets();

datasetsHelper.readyAllCallback(function() {
  calendarChart.run();
  calendarControls.initLocationButtons();
  calendarControls.initWeatherButtons();
});
