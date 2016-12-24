var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var tripIt = require("tripit-node");
var json = require('json-update');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

var tripItClient = new tripIt("f7630b87eb4992a2f85f12a74967b86d06b7f696", "08826ce1922e7d3cafaf0581761cd20534b5c1fe");
var requestTokenSecrets = {};

// Setup Route Bindings
exports = module.exports = function(app) {

	// View routes
	app.get('/', routes.views.index);
	app.get('/sync', routes.views.sync);
	app.get('/lights', routes.views.lights);

	// External API routes
	app.get('/api/lightrule/list', routes.api.lightRuleList);
	app.get('/api/lights/list', routes.api.lightList);
	app.get('/api/groups/list', routes.api.groupList);
	app.get('/api/trips', routes.api.trips);
	app.post('/api/sync/lights', routes.api.syncLights);
	app.get('/api/travelday/list', routes.api.travelDayList);
	app.post('/api/travelday/add', routes.api.travelDayAdd);

	// Internal API routes
	app.get("/api/authorize", function (req, res) {
		tripItClient.getRequestToken().then(function(results) {
			var token = results[0],
				secret = results[1];
			requestTokenSecrets[token] = secret;
			res.redirect("https://www.tripit.com/oauth/authorize?oauth_token=" + token + "&oauth_callback=http://localhost:3000/api/callback");
		}, function(error) {
			res.send(error);
		});
	});

	app.get("/api/callback", function (req, res) {
		var token = req.query.oauth_token;
		var secret = requestTokenSecrets[token];
		var verifier = req.query.oauth_verifier;

		tripItClient.getAccessToken(token, secret, verifier).then(function(results) {
			var accessToken = results[0],
				accessTokenSecret = results[1];
			tripItClient.requestResource("/get/profile", "GET", accessToken, accessTokenSecret).then(function(results) {
				var creds = {
					'token': accessToken,
					'secret': accessTokenSecret,
					'response': JSON.parse(results[0])
				};
				res.send(creds);
			});
		}, function(error) {
			res.send(error);
		});
	});
};
