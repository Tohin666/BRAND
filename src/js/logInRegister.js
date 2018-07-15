(function ($) {
  $(function () {
    $('#logInButton').on('click', function () {
      var email = $('#email6').val();
      var password = $('#password').val();
      var success = 0;
      $.get('http://localhost:5000/users', {}, function (users) {
        users.forEach(function (user) {
          if (user.email === email && user.password === password) {
            success = 1;
            alert('You are logged successfully!')
          }
        });
        if (success === 0) {
          alert('Email or password is not correct!')
        }
      })
    });

    $('#registerButton').on('click', function () {
      var email = $('#email6').val();
      var password = $('#password').val();
      var success = 1;
      $.get('http://localhost:5000/users', {}, function (users) {
        if (!(email) || !(password)) {
          alert('Enter login and password!');
          success = 0
        }
        users.forEach(function (user) {
          if (user.email === email) {
            alert('This email already registered!');
            success = 0
          }
        });
        if (success === 0) {return}

        var user = {
          email: email,
          password: password
        };

        $.post('http://localhost:5000/users', user, function (response) {
        }, 'json');

        if (success === 1) {
          alert('You are registered successfully!')
        }
      })
    })
  })
})(jQuery);