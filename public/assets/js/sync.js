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

  var socket = null;
  var key = null;

  module.sync = function(isDesktop) {
    if ('io' in window) {
      if (socket) {
        socket.disconnect();
      }

      socket = io.connect('/');

      if (isDesktop) {
        module.identify('desktop');
      }

      socket.on('key', function(k) {
        key = k;
        alert(key);
      });

      socket.on('link', function(found, userKey) {
        if (found) {
          module.hideSyncControls();
          key = userKey;

          if (isDesktop) {
            utils.middleCalendar(true);
          }
        } else {
          alert('no!');
        }

        module.resetSyncControls();
      });

      socket.on('disconnect', function() {
        if (!isDesktop) {
          module.showSyncControls();
        }

        socket = null;

        if (isDesktop) {
          utils.middleCalendar(false);
        }

        module.sync(isDesktop);
      });

      socket.on('status', function(userKey, location, year, weatherCondition) {
        if (userKey == key) {
          calendarControls.setStatus(location, year, weatherCondition);
        }
      });
    }
  };

  module.identify = function(identity, userKey) {
    if (socket) {
      socket.emit('identity', identity, userKey);
    } else {
      console.log('Socket undefined.');
    }
  };

  module.getKey = function() {
    return key;
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

    if (socket) {
      socket.emit('update-status', key, status.location, status.year, status.weatherCondition);
    } else {
      console.log('Socket undefined.');
    }
  };

  return module;
}();
