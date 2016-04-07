Template.changeUsername.events({
    'submit form': function (event) {
        event.preventDefault();
        var username = $('[id=username]').val();
        Meteor.call('changeUsername', username, function (error, result) {
            if (error) {
                toastr.error(error.reason, 'Change Username')
            } else {
                toastr.success('Your username has successfully been changed.', 'Change Username');
                $('#changeUsername').modal('hide');
            }
        });
    }
});
