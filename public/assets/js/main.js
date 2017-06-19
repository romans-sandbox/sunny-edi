utils.checkRequirements();

datasetsHelper.loadAlDatasets();

datasetsHelper.readyAllCallback(function() {
  calendarWeekChart.init();
  calendarChart.init();
  calendarControls.initLocationButtons();
  calendarControls.initYearButtons();
  calendarControls.initWeatherIcons();
  calendarControls.initWeatherButtons();
  calendarControls.initFullscreenLink();
  calendarControls.initCreditsLink();
  calendarControls.initJoystick();
  calendarControls.initSyncToggle();
  legends.init();
  calendarControls.setStatus('edinburgh', '2015', 'sunny');

  utils.initAdaptContentEvents(function(isDesktop) {
    sync.sync(isDesktop);

    if (!isDesktop) {
      sync.initSyncControls();
    }
  });
});
