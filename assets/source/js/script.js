(function ($) {
  $(document).ready(function () {

    let explorerFilter = $('#searchFilter')
    explorerFilter.on('click', (e) => {
      e.preventDefault()
      $('.filter-drawer').toggle();
    })

  })
} )( jQuery )