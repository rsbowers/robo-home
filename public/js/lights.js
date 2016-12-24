// jshint devel:true

(function($) {
	'use strict';
	APP.Lights = (function(Lights) {
		return Lights = {
			init: function() {
				$('.js-switch').each(function(){
					var switchery = new Switchery(this, { disabled: true, size: 'large', secondaryColor: '#666', jackColor: '#fff', jackSecondaryColor: '#fff' });
				});
				$('.js-switch').change(function(){
					console.log($(this).is(":checked"));
				})
			}
		};
	})(APP.Lights || {}); //Fired from APP
})(jQuery);
