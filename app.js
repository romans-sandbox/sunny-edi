var express = require('express');
var socket = require('socket.io');

var app = express();
var port = process.env.PORT || 8080;

io = socket.listen(app.listen(port));

app.use(express.static(__dirname + '/public'));

var instances = {};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

io.on('connection', function(socket) {
  console.log('>', socket.id);

  socket.on('identity', function(identity, userKey) {
    var key = null;

    if (identity === 'desktop') {
      key = getRandomInt(1000, 9999);

      while (key in instances) {
        key = getRandomInt(1000, 9999);
      }

      instances[key] = {
        desktop: socket,
        mobile: null,
        location: null,
        year: null,
        weatherCondition: null
      };

      socket.emit('key', key);

      console.log('k', socket.id, key);
    } else if (identity === 'mobile' && userKey) {
      if (userKey in instances) {
        instances[userKey].mobile = socket;
        socket.emit('link', true, userKey);
        socket.broadcast.emit('link', true, userKey);
        console.log('v', instances[userKey].desktop.id, instances[userKey].mobile.id);
      } else {
        socket.emit('link', false);
        console.log('x', socket.id);
      }
    } else {
      socket.emit('link', false);
      console.log('x', socket.id);
    }
  });

  socket.on('update-status', function(userKey, location, year, weatherCondition) {
    if (userKey) {
      instances[userKey].location = location;
      instances[userKey].year = year;
      instances[userKey].weatherCondition = weatherCondition;

      socket.emit('status', userKey, location, year, weatherCondition);
      socket.broadcast.emit('status', userKey, location, year, weatherCondition);

      console.log('u', userKey);
    }
  });

  socket.on('disconnect', function() {
    var key;

    for (key in instances) {
      if (instances.hasOwnProperty(key)) {
        if (instances[key].desktop && instances[key].desktop.id === socket.id
          || instances[key].mobile && instances[key].mobile.id === socket.id) {
          if (instances[key] && instances[key].desktop) {
            instances[key].desktop.disconnect();
          }

          if (instances[key] && instances[key].mobile) {
            instances[key].mobile.disconnect();
          }

          delete instances[key];

          console.log('d', key);

          break;
        }
      }
    }

    console.log('<', socket.id);
  });
});
