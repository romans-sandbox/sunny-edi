var express = require('express');
var io = require('socket.io');

var app = express();
var port = process.env.PORT || 8080;

io.listen(app.listen(port));

app.use(express.static(__dirname + '/public'));
