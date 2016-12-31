var lightify = require('node-lightify');
var twilioClient = require('./../twilio-client');
var config = require('../../server.json');
var connection = new lightify.lightify(config.lightify);

function LightifyGateway() {

}

LightifyGateway.prototype.getGroupInfo = function(callback) {
	connection.connect(config.lightify).then(function() {
		return connection.discover();
	}).then(function(data) {
		callback(data.result);
		connection.dispose();
	}).catch(function(error) {
		console.log(error);
	});
}

LightifyGateway.prototype.toggleLights = function(state) {
	connection.connect(config.lightify).then(function() {
		return connection.discover();
	}).then(function(data) {
		for (var i = 0; i < data.result.length; i++) {
			var light = data.result[i];
			if(light.status !== state){
				var onoff = (state > 0) ? 'on' : 'off';
				twilioClient.sendMessage('Your lights have been turned ' + onoff);
				connection.nodeOnOff(light.mac, state);
			}
		}
		connection.dispose();
	}).catch(function(error) {
		console.log(error);
	});
}

LightifyGateway.prototype.switchLight = function(id,state,callback) {
	var onoff = state;
	connection.connect(config.lightify).then(function() {
		return connection.discover();
	}).then(function(data) {
		connection.nodeOnOff(Number(id), Number(state));
		callback({'id':id,'state':state});
		connection.dispose();
	}).catch(function(error) {
		console.log(error);
	});
}

var lightifyGateway = new LightifyGateway();

module.exports = lightifyGateway;
