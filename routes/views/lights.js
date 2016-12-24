var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	var phillipsBridge = keystone.get('phillipsBridge');
	phillipsBridge.getGroupInfo(function(data){
		var lights = [];
		for (var i = 0; i < data.length; i++) {
			var group = data[i];
			lights.push({
				'id':group.id,
				'name':group.name,
				'on':group.action.attributes.on
			});
		}
		view.render('lights',{'groups':lights,layout: 'plain'});
	})

};
