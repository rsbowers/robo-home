var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var onoff = req.params.state;
	var state = (onoff == 'on') ? 1 : 0;
	var lightify = keystone.get('lightify');
	lightify.toggleLights(state);
	res.send('Success');
};
