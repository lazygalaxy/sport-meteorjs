Template.forgotPassword.events({
    'submit #forgotPassword-form': function (event) {
        event.preventDefault();
        var email = $('[id=email]').val();

        Accounts.forgotPassword({
            email: email
        }, function (error) {
            if (error) {
                toastr.error(error.reason, 'Forgot Password')
            } else {
                toastr.success('A new password has been emailed to you.', 'Forgot Password')
            }
        });
    }
});
