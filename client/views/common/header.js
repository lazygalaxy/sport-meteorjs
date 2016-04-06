Template.header.events({
    'submit #login-form': function (event) {
        event.preventDefault();
        var username = $('[id=username]').val();
        var password = $('[id=password]').val();

        Meteor.loginWithPassword(username, password, function (error) {
            if (error) {
                toastr.error(error.reason, 'Login Denied')
            } else {
                Router.go("home");
            }
        });
    },
    'click .logout': function (event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    },
    'click .back-button': function (event) {
        history.back();
    }
});
