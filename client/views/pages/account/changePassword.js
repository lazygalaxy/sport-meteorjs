Template.changePassword.events({
    'submit form': function (event) {
        event.preventDefault();
        var oldPassword = $('[name=old]').val();
        var newPassword = $('[name=new]').val();

        Accounts.changePassword(oldPassword, newPassword, function (error) {
            if (error) {
                toastr.error(error.reason, 'Change Password')
            } else {
                toastr.success('Your password has successfully been changed.', 'Change Password')
                $('#changePassword').modal('hide');
            }
        });
    }
});
