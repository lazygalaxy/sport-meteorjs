Template.changeUsername.events({
    'submit form': function (event) {
        event.preventDefault();
        var username = $('[id=username]').val();

        Meteor.call('changeUsername', username, function (error, result) {
            if (error) {
                toastr.error(error.reason)
            } else {
                toastr.success('Username has successfully been changed.');
                $('#changeUsername').modal('hide');
            }
        });
    }
});
