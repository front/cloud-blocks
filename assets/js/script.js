'use strict';

(function ($) {
  $(document).ready(function () {

    var explorerFilter = $('#searchFilter');
    explorerFilter.on('click', function (e) {
      e.preventDefault();
      $('.filter-drawer').toggle();
    });
  });
})(jQuery);
