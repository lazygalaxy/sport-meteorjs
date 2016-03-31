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
        });

        Router.go('predictions');
    }
});
