var tripIt = require("tripit-node");
var json = require('json-update');

exports = module.exports = function(req, res) {
	var clientTokenSectrets = {
		'token': '755a6b71d11f8031f1a7f6e114931f9edd94f0dc',
		'secret': 'a97d9979f3d2786b595e7c63da9a9902e37560fc'
	}
	var client = new tripIt("f7630b87eb4992a2f85f12a74967b86d06b7f696", "08826ce1922e7d3cafaf0581761cd20534b5c1fe");
	client.requestResource("/list/trip", "GET", clientTokenSectrets.token, clientTokenSectrets.secret).then(function (results) {
		var creds = {
			'response': JSON.parse(results[0])
		};
		res.send(creds);
	}, function (error) {
		res.send(error);
	});
};
