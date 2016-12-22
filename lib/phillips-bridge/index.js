var huejay = require('huejay');
var twilioClient = require('./../twilio-client');

var client = new huejay.Client({
    host: '192.168.1.24',
    username: 'rnVTrfW-f89xK9QIXUMTBLQJnhofaYOTvRHf3Qa6'
});

function PhillipsBridge() {

}

PhillipsBridge.prototype.init = function() {
  phillipsBridge.toggleLights(false);
}

PhillipsBridge.prototype.getLightInfo = function() {
    client.lights.getAll()
        .then(function(lights) {
            for (var i=0; i<lights.length; i++) {
                var light = lights[i];
                console.log(`Light [${light.id}]: ${light.name}`);
                console.log(`  Type:             ${light.type}`);
                console.log(`  Unique ID:        ${light.uniqueId}`);
                console.log(`  Manufacturer:     ${light.manufacturer}`);
                console.log(`  Model Id:         ${light.modelId}`);
                console.log('  Model:');
                console.log(`    Id:             ${light.model.id}`);
                console.log(`    Manufacturer:   ${light.model.manufacturer}`);
                console.log(`    Name:           ${light.model.name}`);
                console.log(`    Type:           ${light.model.type}`);
                console.log(`    Color Gamut:    ${light.model.colorGamut}`);
                console.log(`    Friends of Hue: ${light.model.friendsOfHue}`);
                console.log(`  Software Version: ${light.softwareVersion}`);
                console.log('  State:');
                console.log(`    On:         ${light.on}`);
                console.log();
            }
        });
}

PhillipsBridge.prototype.toggleLights = function(state) {
    var onoff = (state) ? 'on' : 'off';
    twilioClient.sendMessage('Your lights have been turned ' + onoff);
    client.lights.getAll()
        .then(function(lights) {
            for (var i=0; i<lights.length; i++) {
                var light = lights[i];
                if(light.id !== state) {
                    phillipsBridge.switchLight(light.id,state);
                }
            }
            return console.log('Completed light switching');
        });
}

PhillipsBridge.prototype.switchLight = function(id,state) {
    client.lights.getById(id)
        .then(function(light) {
            light.on = state;

            return client.lights.save(light);
        })
        .then(function(light) {
            return console.log(`Updated light [${light.id}]`);
        })
        .catch(function(error) {
            console.log('Something went wrong');
            console.log(error.stack);
        });
}

PhillipsBridge.prototype.pingBridge = function() {
    client.bridge.ping()
        .then(function() {
            console.log('Successful connection');
        })
        .catch(function(error) {
            console.log('Could not connect');
        });
}

PhillipsBridge.prototype.createUser = function() {
    var user = new client.users.User;

    // Optionally configure a device type / agent on the user
    user.deviceType = 'my_device_type'; // Default is 'huejay'

    client.users.create(user)
        .then(function(user) {
            console.log(`New user created - Username: ${user.username}`);
        })
        .catch(function(error) {
            if (error instanceof huejay.Error && error.type === 101) {
                return console.log(`Link button not pressed. Try again...`);
            }

            console.log(error.stack);
        });
}

PhillipsBridge.prototype.getUserDetail = function() {
    client.users.get()
        .then(function(user) {
            console.log('Username:', user.username);
            console.log('Device type:', user.deviceType);
            console.log('Create date:', user.created);
            console.log('Last use date:', user.lastUsed);
        });
}

PhillipsBridge.prototype.discoverBridge = function() {
    huejay.discover()
        .then(function(bridges) {
            for (var i=0; i<bridges.length; i++) {
                var bridge = bridges[i];
                console.log(`Id: ${bridge.id}, IP: ${bridge.ip}`);
            }
        })
        .catch(function(error) {
            console.log(`An error occurred: ${error.message}`);
        });
}

var phillipsBridge = new PhillipsBridge();

module.exports = phillipsBridge;
