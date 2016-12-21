var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var LightRule = keystone.list('LightRule');
	LightRule.model.find()
	  .exec(function(err, data) {
	    res.send(data);
		});
};
