(function ($) {

  function buildCart() {
    $.get('http://localhost:5000/cart', {}, function (items) {

      var total = 0;

      $('.cart-list__item').remove();

      items.forEach(function (item) {
        total += +item.price * +item.quantity;

        var $divCartListItem = $('<div/>').addClass('cart-list__item');
        var $divCartListColumns = $('<div/>').addClass('cart-list__columns');
        var $divCartListProductDetails = $('<div/>').addClass('cart-list__Product-Details');
        var $aImgCartlistImg = $('<a/>')
          .attr('href', item.url)
          .append($('<img/>', {
            class: "cart-list__img",
            src: item.src,
            alt: item.name
          }));

        var $divCartListDesc = $('<div/>').addClass('cart-list__desc');
        $divCartListDesc.append($('<div/>').addClass('cart-list__name')
          .append($('<a/>', {
            href: item.url,
            text: item.name
          })));
        $divCartListDesc.append($('<div/>').text('Color: ')
          .append($('<span/>', {
            class: "cart-list__color-size",
            text: item.color
          })));
        $divCartListDesc.append($('<div/>').text('Size: ')
          .append($('<span/>', {
            class: "cart-list__color-size",
            text: item.size
          })));

        var $divCartListUnitePrice = $('<div/>').addClass('cart-list__unite-Price').text('$' + item.price);
        var $divCartListQuantity = $('<div/>').addClass('cart-list__Quantity')
          .append($('<input>', {
            type: "text",
            placeholder: item.quantity,
            pattern: "[0–9]{1,5}",
            "data-id": item.id,
            class: "inputQuantityCart",
            "data-name": item.name,
            "data-price": item.price,
            "data-src": item.src,
            "data-url": item.url,
            "data-color": item.color,
            "data-size": item.size
          }));
        var $divCartListShipping = $('<div/>').addClass('cart-list__shipping').text('FREE');
        var $divCartListSubtotal = $('<div/>').addClass('cart-list__Subtotal').text('$' + item.price * item.quantity);
        var $divCartListACTION = $('<div/>').addClass('cart-list__ACTION')
          .append($('<a/>', {
            "data-id": item.id,
            class: "removeButton"
          })
            .append($('<i/>', {
              class: "fas fa-times-circle"
            })));

        $divCartListProductDetails.append($aImgCartlistImg);
        $divCartListProductDetails.append($divCartListDesc);
        $divCartListColumns.append($divCartListProductDetails);
        $divCartListColumns.append($divCartListUnitePrice);
        $divCartListColumns.append($divCartListQuantity);
        $divCartListColumns.append($divCartListShipping);
        $divCartListColumns.append($divCartListSubtotal);
        $divCartListColumns.append($divCartListACTION);
        $divCartListItem.append($divCartListColumns);
        $('.cart-list').append($divCartListItem);
      });

      //Handler manual change good quantity.
      $('.cart-list__item').on('change', 'input', function (event) {

        var cartGood = $('.cart-list__Quantity input[data-id="' + $(this).attr('data-id') + '"]');

        var good = {
          id: $(this).attr('data-id'),
          quantity: +cartGood.eq(0).val(),
          name: $(this).attr('data-name'),
          price: $(this).attr('data-price'),
          src: $(this).attr('data-src'),
          url: $(this).attr('data-url'),
          color: $(this).attr('data-color'),
          size: $(this).attr('data-size')
        };

        $.ajax({
          url: 'http://localhost:5000/cart/' + good.id,
          type: 'PUT',
          data: good,
          success: function () {
            buildCart();
            // buildGoodsList();
            buildCartIcon()
          }
        });

        event.preventDefault();
      });

      //Handler removes item.
      $('.cart-list__item').on('click', '.removeButton', function (event) {
        // var deletedGoodID = $(this).parent().attr('data-id');
        var deletedGoodID = $(this).attr('data-id');
        $.ajax({
          url: 'http://localhost:5000/cart/' + deletedGoodID,
          type: 'DELETE',
          success: function () {
            buildCartIcon();
            buildCart();
          }
        });
        event.preventDefault();
      });

      $('.price-tab').text('$' + total);
      $('.price-red').text('$' + total);

    }, 'json');
  }

  $(function () {
    buildCart();

    $('#goods').on('click', '.buy', function (event) {

      var good = {
        id: $(this).attr('data-id'),
        name: $(this).attr('data-name'),
        price: $(this).attr('data-price'),
        src: $(this).attr('data-src'),
        url: $(this).attr('data-url'),
        color: $(this).attr('data-color'),
        size: $(this).attr('data-size')
      };

      var cartGood = $('#cart li[data-id="' + $(this).attr('data-id') + '"]');
      if (cartGood.length) {
        good.quantity = +cartGood.eq(0).attr('data-quantity') + 1;

        $.ajax({
          url: 'http://localhost:5000/cart/' + good.id,
          type: 'PUT',
          data: good,
          success: function () {
            buildCart();

          }
        })
      } else {
        good.quantity = 1;
        $.post('http://localhost:5000/cart', good, function (response) {
          buildCart();

        }, 'json');
      }
      event.preventDefault();
    });


    $('#clearButton').on('click', function (event) {

      $.get('http://localhost:5000/cart/', {}, function (items) {
          items.forEach(function (item) {
            $.ajax({
              url: 'http://localhost:5000/cart/' + item.id,
              type: 'DELETE',
              success: function () {
                buildCart();
                buildCartIcon();
              }
            })
          });
        }
      );

      event.preventDefault()
    });
  });
})(jQuery);