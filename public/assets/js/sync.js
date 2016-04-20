var sync = function() {
  var module = {};

  var v = {};

  v.syncControlsContainer = document.querySelector('#sync-container');
  v.controlsContainer = document.querySelector('#controls');
  v.syncField = document.querySelector('#sync-field');
  v.syncSubmit = document.querySelector('#sync-submit');

  var re = {
    key: /^\d{4}$/
  };

  var data = {
    socket: null,
    key: null
  };

  module.sync = function(isDesktop) {
    if ('io' in window) {
      if (data.socket) {
        data.socket.disconnect();
      }

      data.socket = io.connect('/');

      if (isDesktop) {
        module.identify('desktop');
      }

      data.socket.on('key', function(key) {
        data.key = key;
      });

      data.socket.on('link', function(found, key) {
        if (found) {
          module.hideSyncControls();
          data.key = key;

          if (isDesktop) {
            utils.middleCalendar(true);
          }
        } else {
          alert('no!');
        }

        module.resetSyncControls();
      });

      data.socket.on('disconnect', function() {
        if (!isDesktop) {
          module.showSyncControls();
        }

        data.socket = null;

        if (isDesktop) {
          utils.middleCalendar(false);
        }

        module.sync(isDesktop);
      });

      data.socket.on('status', function(key, location, year, weatherCondition) {
        if (key == data.key) {
          calendarControls.setStatus(location, year, weatherCondition);
        }
      });
    }
  };

  module.identify = function(identity, userKey) {
    if (data.socket) {
      data.socket.emit('identity', identity, userKey);
    } else {
      console.log('Socket undefined.');
    }
  };

  module.getKey = function() {
    return data.key;
  };

  module.initSyncControls = function() {
    v.syncSubmit.addEventListener('click', function() {
      var userKey;

      userKey = v.syncField.value.trim();

      if (!userKey.match(re.key)) {
        alert('Wrong value.');
        v.syncField.focus();
        return;
      }

      v.syncField.disabled = true;
      v.syncSubmit.disabled = true;

      module.identify('mobile', userKey);
    }, false);
  };

  module.resetSyncControls = function() {
    v.syncField.disabled = false;
    v.syncSubmit.disabled = false;
  };

  module.hideSyncControls = function() {
    v.syncControlsContainer.classList.add('invisible');
    v.controlsContainer.classList.add('visible');
  };

  module.showSyncControls = function() {
    v.syncControlsContainer.classList.remove('invisible');
    v.controlsContainer.classList.remove('visible');
  };

  module.emitStatus = function() {
    var status;

    status = calendarControls.getStatus();

    if (data.socket) {
      data.socket.emit('update-status', data.key, status.location, status.year, status.weatherCondition);
    } else {
      console.log('Socket undefined.');
    }
  };

  return module;
}();
