'use strict';
var io = require('socket.io')(9000);
var fs = require('fs');
var clients = [];

io.on('connection', function (client) {
    client.on('join', function() {
      console.log('client has connected');
    });

    client.on('disconnect', function(){
      console.log('client has disconnected');
    });

    client.on('reconnect', function() {
      console.log('client has reconnected');
    });

    client.on('fetchItinerary', function() {
      console.log('fetchItinerary');
      io.emit('fetchItinerary');
    });

    console.log('Socket Server started on port 9000');
});
