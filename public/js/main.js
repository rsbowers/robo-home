// jshint devel:true


(function () {
  'use strict';

  //==================================================
  // "APP" NAMESPACE
  //--------------------------------------------------
  window.APP = (typeof APP !== 'undefined' && APP instanceof Object) ? APP : {

    //--------------------------------------------------
    // CONFIGS
    //--------------------------------------------------
    configs: {

    },

    //--------------------------------------------------
    // UTILITY METHODS
    //--------------------------------------------------
    utils: {
      getIEVersion: function () {
        var agent = navigator.userAgent;
        var reg = /MSIE\s?(\d+)(?:\.(\d+))?/i;
        var matches = agent.match(reg);
        if (matches !== null) {
          return {
            major: matches[1],
            minor: matches[2]
          };
        }
        return {
          major: '-1',
          minor: '-1'
        };
      },
      getViewport: function () {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        var size;
        if ($('html').hasClass('lt-ie9')) {
          size = 'large';
        } else {
          size = (w <= APP.configs.views.xsmall) ? 'xsmall' : size;
          size = (w > APP.configs.views.xsmall) ? 'small' : size;
          size = (w > APP.configs.views.small) ? 'medium' : size;
          size = (w > APP.configs.views.medium) ? 'large' : size;
          size = (w > APP.configs.views.large) ? 'xlarge' : size;
        }

        APP.configs.viewport = {
          size: size,
          width: w,
          height: h
        };

        return APP.configs.viewport;
      }
    }
  };
  //--------------------------------------------------
  // end "APP" NAMESPACE
  //==================================================

  //==================================================
  // DOCUMENT READY...
  //--------------------------------------------------

  $(function () {

    // APP.utils.getViewport();

    //--------------------------------------------------
    // Add IE10 Class
    //--------------------------------------------------
    if (APP.utils.getIEVersion().major === '10') {
      $('html').addClass('ie10');
    }
    //--------------------------------------------------

    //--------------------------------------------------
    //  INIT MODULES
    //  Initialize the app's modules
    //--------------------------------------------------
    APP.Sync.init();
		APP.Lights.init();
    // end INIT MODULES
    // do not remove the above comment
    //==================================================

  });

  //--------------------------------------------------
  // end DOCUMENT READY...
  //==================================================

}());
