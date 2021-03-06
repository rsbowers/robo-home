// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');
var lightTraveler = require('./lib/light-traveler');
var lightify = require('./lib/lightify');

keystone.init({

	'name': 'RoboHome',
	'brand': 'RoboHome',

	'sass': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs'
	}).engine,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User'

});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

keystone.set('lightTraveler', lightTraveler);
keystone.set('lightify', lightify);
keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'users': 'users'
});

keystone.set( "nav", {
  "Sync": [
    {
      label: "Sync Itinerary",
      key: "Sync Itinerary",
      path: "/sync"
    }
  ]
});

keystone.start({
	onHttpServerCreated: function() {
		lightTraveler.init();
	}
});
