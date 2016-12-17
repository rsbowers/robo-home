var http = require('http'),
    lightTraveler = require('./light-traveler'),
    serverConfig = require('./server.json');

var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.write('Robo Home Services');
    res.end();
});

var port = 9001;
server.listen(port, function() {
    console.log('server listening on port ' + port);
    var address = serverConfig.socketAddr + ":" + serverConfig.socketPort
    var socket = require('socket.io-client')(address);
    socket.on('connect', function() {
        socket.emit('join');
    });
    lightTraveler.init();
});
