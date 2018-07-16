jQuery(document).ready(function ($) {

  $.get('http://localhost:5000/goods/', {}, function (items) {
    items.forEach(function (item) {
      var $aItem = $('<a/>', {
        text: item.name,
        href: 'single-page.html'
      });
      var $liItem = $('<li/>').append($aItem);

      $('.live-search-list').append($liItem)
    });
    $('.live-search-list li').each(function () {
      $(this).attr('data-search-term', $(this).text().toLowerCase());
    });
  });

  $('.searchForItem').on('focus', function () {

    $('.live-search-list').show();

  });
  $('.searchForItem').on('focusout', function () {

    $('.live-search-list').delay(500).hide(0);

  });


  $('.searchForItem').on('keyup', function () {

    var searchTerm = $(this).val().toLowerCase();

    $('.live-search-list li').each(function () {

      if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
        $(this).show();
      } else {
        $(this).hide();
      }

    });

  });

});