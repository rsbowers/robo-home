var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var TravelDay = keystone.list('TravelDay');
	TravelDay.model.find()
	  .exec(function(err, data) {
	    res.send(data);
		});
};
