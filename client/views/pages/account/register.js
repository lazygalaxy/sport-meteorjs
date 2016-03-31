Template.register.events({
    'submit form': function (event) {
        event.preventDefault();
        var username = $('[name=username]').val();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();

        Accounts.createUser({
            username: username,
            email: email,
            password: password
        }, function (error) {
            if (error) {
                toastr.error(error.reason, 'Login Denied')
            } else {
                Router.go("home");
            }
        });
    }
});
