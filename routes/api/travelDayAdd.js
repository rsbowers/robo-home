var keystone = require('keystone');

exports = module.exports = function(req, res) {
	console.log(req.body)
	var TravelDay = keystone.list('TravelDay');
	var newTravelDay = new TravelDay.model({
			name: req.body.primary_location + ', ' + req.body.day,
			day: req.body.day,
			trip: req.body.trip
	});
	newTravelDay.save(function(err) {
			// post has been saved
			console.log('saved',err);
			res.send(newTravelDay);
	});
};
