var keystone = require('keystone');

exports = module.exports = function(req, res) {
	var lightify = keystone.get('lightify');
	lightify.getGroupInfo(function(data){
		res.send(JSON.stringify(data,null,3));
	})
};
