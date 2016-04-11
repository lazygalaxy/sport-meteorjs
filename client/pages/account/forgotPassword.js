Template.forgotPassword.events({
    'submit #forgotPassword-form': function (event) {
        event.preventDefault();
        var email = $('[id=email]').val();

        Accounts.forgotPassword({
            email: email
        }, function (error) {
            if (error) {
                toastr.error(error.reason);
            } else {
                toastr.success('An email to reset your password has been sent to you.');
                Router.go('home');
            }
        });
    }
});
