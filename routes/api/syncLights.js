var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var lightTraveler = keystone.get('lightTraveler');
	lightTraveler.fetchItinerary();
	console.log('sync lightTraveler.fetchItinerary');
	res.send('Success');
};
