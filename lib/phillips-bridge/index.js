var huejay = require('huejay');
var twilioClient = require('./../twilio-client');
var config = require('../../server.json');

var client = new huejay.Client({
	host: config.phillipsBridge,
	username: 'rnVTrfW-f89xK9QIXUMTBLQJnhofaYOTvRHf3Qa6'
});

function PhillipsBridge() {

}

PhillipsBridge.prototype.init = function() {

}

PhillipsBridge.prototype.getLightInfo = function(callback) {
	client.lights.getAll()
		.then(function(lights) {
			var ary = [];
			for (var i = 0; i < lights.length; i++) {
				var light = lights[i];
				ary.push(light);
			}
			callback(ary);
		});
}

PhillipsBridge.prototype.getGroupInfo = function(callback) {
	client.groups.getAll()
		.then(function(groups) {
			var ary = [];
			for (var i = 0; i < groups.length; i++) {
				var group = groups[i];
				ary.push(group);
			}
			callback(ary);
		});
}

PhillipsBridge.prototype.toggleLights = function(state) {
	var onoff = (state) ? 'on' : 'off';
	twilioClient.sendMessage('Your lights have been turned ' + onoff);
	client.lights.getAll()
		.then(function(lights) {
			for (var i = 0; i < lights.length; i++) {
				var light = lights[i];
				if (light.id !== state) {
					phillipsBridge.switchLight(light.id, state);
				}
			}
			return console.log('Completed light switching');
		});
}

PhillipsBridge.prototype.switchLight = function(id, state, callback) {
	client.lights.getById(id)
		.then(function(light) {
			var toggle = (state == 'on') ? true : false;
			light.on = toggle;
			return client.lights.save(light);
		})
		.then(function(light) {
			if(callback){
				callback(light);
			}
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
			for (var i = 0; i < bridges.length; i++) {
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
