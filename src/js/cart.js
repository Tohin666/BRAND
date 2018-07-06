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
        'data-quantity': good.quantity
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
      if (+$(this).attr('data-quantity') < 1) {
        alert('Недостаточно товара');
        return;
      }
      var good = {
        id: $(this).attr('data-id'),
        name: $(this).attr('data-name'),
        price: $(this).attr('data-price')
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