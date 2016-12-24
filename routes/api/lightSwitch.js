var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var id = req.body.id;
	var state = req.body.state;
	console.log(id,state);
	var phillipsBridge = keystone.get('phillipsBridge');
	phillipsBridge.switchLight(id,state.toString(),function(data){
		res.send(data);
	})
};
