datasetsHelper.loadAlDatasets();

datasetsHelper.readyAllCallback(function() {
  calendarWeekChart.init();
  calendarChart.init();
  calendarControls.initLocationButtons();
  calendarControls.initYearButtons();
  calendarControls.initWeatherButtons();
  calendarControls.initWeatherIcons();
  calendarControls.initFullscreenLink();
  calendarControls.initCreditsLink();
  legends.init();
  calendarControls.setStatus('edinburgh', '2015', 'sunny');
});
