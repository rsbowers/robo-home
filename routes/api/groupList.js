var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var phillipsBridge = keystone.get('phillipsBridge');
	phillipsBridge.getGroupInfo(function(data){
		res.send(JSON.stringify(data,null,3));
	})
};
