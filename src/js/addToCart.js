(function ($) {

  window.buildCartIcon = function () {
    $.get('http://localhost:5000/cart/', function (cartGoods) {
      $('.cartIconQuantity').remove();
      if (cartGoods.length) {
        var totalQuantity = 0;
        cartGoods.forEach(function (cartGood) {
          totalQuantity += +cartGood.quantity
        });

        $('.img-cart').append($('<div/>', {
          class: 'cartIconQuantity',
          text: totalQuantity
        }))
      }
    });

  };

  $(function () {
    buildCartIcon();

    $('.addToCartButton').on('click', function (event) {

      var goodID = $(this).attr('data-id');

      $.get('http://localhost:5000/goods', {}, function (goods) {

        var good = goods[goodID - 1];

        var jqxhr = $.get('http://localhost:5000/cart/' + goodID, function (cartGood) {

          cartGood.quantity++;

          $.ajax({
            url: 'http://localhost:5000/cart/' + goodID,
            type: 'PUT',
            data: cartGood,
            success: function () {
              buildCartIcon()
            }
          })
        })

          .fail(function () {
            console.log(good.quantity);
            good.quantity = 1;
            console.log(good.quantity);
            $.post('http://localhost:5000/cart', good, function (response) {
              buildCartIcon()
            }, 'json');
          })

      }, 'json');

      event.preventDefault();
    });
  });

})(jQuery);