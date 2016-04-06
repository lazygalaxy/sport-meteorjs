Template.register.events({
    'submit #register-form': function (event) {
        event.preventDefault();
        var username = $('[id=registerUsername]').val();
        var email = $('[id=email]').val();
        var password = $('[id=registerPassword]').val();

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
