Template.register.events({
    'submit #register-form': function (event) {
        event.preventDefault();
        var username = $('[id=registerUsername]').val();
        var email = $('[id=email]').val();
        var password = $('[id=registerPassword]').val();

        var userId = Accounts.createUser({
            username: username,
            email: email,
            password: password
        }, function (error) {
            if (error) {
                toastr.error(error.reason, 'Login Denied')
            } else {
                var emails = getUnverifiedEmails();
                Meteor.call('sendVerificationEmails', emails, function (error, result) {
                    if (error) {
                        toastr.error(error.reason);
                    } else {
                        toastr.success('Verification link sent to: ' + emails);
                    }
                });

                Router.go("home");
            }
        });
    }
});
