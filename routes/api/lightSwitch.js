var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var id = req.body.id;
	var state = req.body.state;
	console.log(id,state);
	var lightify = keystone.get('lightify');

	lightify.switchLight(id,state,function(data){
		res.send(data);
	})

	// lightify.toggleLights(0);
	// res.send('sup')
};
