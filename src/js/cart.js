(function ($) {

  function buildGoodsList() {
    $.get('http://localhost:5000/goods', {}, function (goods) {
      $('#goods').empty();
      goods.forEach(function (good) {
        var $button = $('<button/>', {
          text: 'Buy',
          class: 'buy',
          'data-id': good.id,
          'data-price': good.price,
          'data-name': good.name,
          'data-src': good.src
        });
        $('<li/>', {
          text: good.name + ' (' + good.quantity + ')'
        }).append($button).appendTo('#goods');
      });
    }, 'json');
  }

  function buildCart() {
    $.get('http://localhost:5000/cart', {}, function (items) {
      $('#cart').empty();
      var $ul = $('<ul/>');
      var total = 0;

      items.forEach(function (item) {
        total += +item.price * +item.quantity;
        var $li = $('<li/>', {
          text: item.name + ': ' + item.price + ' rub.',
          'data-id': item.id,
          'data-quantity': item.quantity
        });
        $li.append($('<button/>', {
          text: 'X',
          class: 'removeButton'
        }));
        $ul.append($li);

        var $divCartListItem = $('<div/>').addClass('cart-list__item');
        var $divCartListColumns = $('<div/>').addClass('cart-list__columns');
        var $divCartListProductDetails = $('<div/>').addClass('cart-list__Product-Details');
        var $aImgCartlistImg = $('<a/>')
          .attr('href', 'single-page.html')
          .append($('<img/>', {
            class: "cart-list__img",
            src: item.src,
            alt: "cart-item1"
          }));

        var $divCartListDesc = $('<div/>').addClass('cart-list__desc');
        $divCartListDesc.append($('<div/>').addClass('cart-list__name')
          .append($('<a/>', {
            href: "single-page.html",
            text: item.name
          })));
        $divCartListDesc.append($('<div/>').text('Color: ')
          .append($('<span/>', {
            class: "cart-list__color-size",
            text: 'Red'
          })));
        $divCartListDesc.append($('<div/>').text('Size: ')
          .append($('<span/>', {
            class: "cart-list__color-size",
            text: 'Xll'
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
            "data-src": item.src
          }));
        var $divCartListShipping = $('<div/>').addClass('cart-list__shipping').text('FREE');
        var $divCartListSubtotal = $('<div/>').addClass('cart-list__Subtotal').text('$300');
        var $divCartListACTION = $('<div/>').addClass('cart-list__ACTION')
          .append($('<a/>')
            .attr('href', '#')
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
        alert('!!!!!!!!!');
        var cartGood = $('.cart-list__Quantity input[data-id="' + $(this).attr('data-id') + '"]');

        var good = {
          id: $(this).attr('data-id'),
          quantity: +cartGood.eq(0).attr('placeholder') + 1,
          name: $(this).attr('data-name'),
          price: $(this).attr('data-price'),
          src: $(this).attr('data-src')
        };

        $.ajax({
          url: 'http://localhost:5000/cart/' + good.id,
          type: 'PUT',
          data: good,
          success: function () {
            buildCart();
            buildGoodsList();
          }
        });

        event.preventDefault();
      });

      $('#cart').append($ul);
      $('#cart').append('Total: ' + total + ' rub.' + '<br>');

      var $clearButton = $('<button/>', {
        text: 'Cleat Cart',
        class: 'clearButton',
        id: 'clearButton'
      });
      $('#cart').append($clearButton)
    }, 'json');
  }


  $(function () {
    buildCart();
    buildGoodsList();

    $('#goods').on('click', '.buy', function (event) {

      var good = {
        id: $(this).attr('data-id'),
        name: $(this).attr('data-name'),
        price: $(this).attr('data-price'),
        src: $(this).attr('data-src')
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
            buildGoodsList();
          }
        })
      } else {
        good.quantity = 1;
        $.post('http://localhost:5000/cart', good, function (response) {
          buildCart();
          buildGoodsList();
        }, 'json');
      }
      event.preventDefault();
    });


    $('#cart').on('click', '#clearButton', function (event) {
      $.get('http://localhost:5000/cart/', {}, function (items) {
          items.forEach(function (item) {
            $.ajax({
              url: 'http://localhost:5000/cart/' + item.id,
              type: 'DELETE',
              success: function () {
                buildCart();
              }
            })
          });
        }
      );


      event.preventDefault()
    });

    $('#cart').on('click', '.removeButton', function (event) {
      var deletedGoodID = $(this).parent().attr('data-id');
      $.ajax({
        url: 'http://localhost:5000/cart/' + deletedGoodID,
        type: 'DELETE',
        success: function () {

          buildCart();
        }
      });
      event.preventDefault();
    })

  });
})(jQuery);