var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var phillipsBridge = keystone.get('phillipsBridge');
	phillipsBridge.getLightInfo(function(data){
		res.send(JSON.stringify(data,null,3));
	})
};
