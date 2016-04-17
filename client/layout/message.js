Template.message.events({
    'click .email-verify-button': function (event) {
        event.preventDefault();
        var emails = getUnverifiedEmails();
        Meteor.call('sendVerificationEmails', emails, function (error, result) {
            if (error) {
                toastr.error(error.reason);
            } else {
                toastr.success('Verification link sent to: ' + emails);
            }
        });
    }
});
