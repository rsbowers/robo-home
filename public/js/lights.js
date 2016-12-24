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
					var state = $(this).is(":checked") ? 'on' : 'off';
					$.ajax({
						url: '/api/light/switch',
						type: 'post',
						data: {
							'id':$(this).data('id'),
							'state':state
						},
						success: function(result) {
							console.log(result);
						}
					});
				})
			}
		};
	})(APP.Lights || {}); //Fired from APP
})(jQuery);
