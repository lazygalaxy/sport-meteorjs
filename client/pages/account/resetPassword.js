Template.resetPassword.events({
    'submit form': function (event) {
        event.preventDefault();
        var resetPassword = $('[id=resetPassword]').val();

        Accounts.resetPassword(Session.get('resetPasswordToken'), resetPassword, function (error) {
            if (error) {
                toastr.error(error.reason);
            } else {
                toastr.success('Your password has successfully been reset.');
                Router.go('home');
            }
        });
    }
});
