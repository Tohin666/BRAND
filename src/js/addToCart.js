(function ($) {

  window.buildCartIcon = function () {
    $.get('http://localhost:5000/cart/', function (cartGoods) {
      $('.cartIconQuantity').remove();
      if(cartGoods.length) {
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
    // buildCart();
    // buildGoodsList();

    $('.addToCartButton').on('click', function (event) {
      // $('#goods').on('click', '.buy', function (event)

      var goodID = $(this).attr('data-id');

      $.get('http://localhost:5000/goods', {}, function (goods) {


        var good = goods[goodID - 1];

        // var $button = $('<button/>', {
        //   text: 'Buy',
        //   class: 'buy',
        //   'data-id': good.id,
        //   'data-price': good.price,
        //   'data-name': good.name,
        //   'data-src': good.src,
        //   'data-url': good.url,
        //   'data-color': good.color,
        //   'data-size': good.size
        // });
        // $('<li/>', {
        //   text: good.name + ' (' + good.quantity + ')'
        // }).append($button).appendTo('#goods');



      // var good = {
      //   id: $(this).attr('data-id'),
      //   name: $(this).attr('data-name'),
      //   price: $(this).attr('data-price'),
      //   src: $(this).attr('data-src'),
      //   url: $(this).attr('data-url'),
      //   color: $(this).attr('data-color'),
      //   size: $(this).attr('data-size')
      // };
      //

        var jqxhr = $.get( 'http://localhost:5000/cart/' + goodID, function(cartGood) {

          cartGood.quantity++;

          $.ajax({
                url: 'http://localhost:5000/cart/' + goodID,
                type: 'PUT',
                data: cartGood,
                success: function () {
                  buildCartIcon()
                  // buildCart();
                  // buildGoodsList();
                }
              })
        })
          // .done(function() {
          //   alert( "second success" );
          // })
          .fail(function() {
            console.log(good.quantity);
            good.quantity = 1;
            console.log(good.quantity);
              $.post('http://localhost:5000/cart', good, function (response) {
                buildCartIcon()
                // buildCart();
                // buildGoodsList();
              }, 'json');
          })
          // .always(function() {
          //   alert( "finished" );
          // });

        // $.get('http://localhost:5000/cart/' + goodID, {}, function (cartGoods) {

      // var cartGood = cartGoods[goodID - 1];

          // var cartGood = $('#cart li[data-id="' + $(this).attr('data-id') + '"]');

      // if (cartGood.length) {
      //   good.quantity = +cartGood.eq(0).attr('data-quantity') + 1;
      //
      //   $.ajax({
      //     url: 'http://localhost:5000/cart/' + good.id,
      //     type: 'PUT',
      //     data: good,
      //     success: function () {
      //       buildCart();
      //       buildGoodsList();
      //     }
      //   })
      // } else {
      //   good.quantity = 1;
      //   $.post('http://localhost:5000/cart', good, function (response) {
      //     buildCart();
      //     buildGoodsList();
      //   }, 'json');
      // }
      //   }, 'json');

      }, 'json');

      event.preventDefault();
    });


  });

})(jQuery);