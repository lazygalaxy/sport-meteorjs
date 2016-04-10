Template.changePassword.events({
    'submit form': function (event) {
        event.preventDefault();
        var oldPassword = $('[id=oldPassword]').val();
        var newPassword = $('[id=newPassword]').val();

        Accounts.changePassword(oldPassword, newPassword, function (error) {
            if (error) {
                toastr.error(error.reason);
            } else {
                toastr.success('Your password has successfully been changed.');
                $('#changePassword').modal('hide');
            }
        });
    }
});
