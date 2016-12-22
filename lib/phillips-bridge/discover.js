var huejay = require('huejay');

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
