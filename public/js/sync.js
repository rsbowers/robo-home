// jshint devel:true

(function($) {
	'use strict';

	APP.Sync = (function(Sync) {
		return Sync = {
			init: function() {
				$('.sync-button').click(function() {
					$('.sync-button').hide();
					$.ajax({
						url: '/api/sync/lights',
						type: 'post',
						success: function(result) {
							$('.sync-message').text('Sync Success!');
						}
					});
				});
			}

		};
	})(APP.Sync || {}); //Fired from APP
})(jQuery);
