getUnverifiedEmails = function () {
    var currentUser = getCurrentUser();
    var emails = [];
    currentUser.emails.forEach(function (email) {
        if (!email.verified) {
            emails.push(email.address);
        }
    });
    return emails;
};

Template.header.helpers({
    getUnverifiedEmails: function () {
        return getUnverifiedEmails();
    }
});

Template.header.events({
    'submit #login-form': function (event) {
        event.preventDefault();
        var username = $('[id=username]').val();
        var password = $('[id=password]').val();

        Meteor.loginWithPassword(username, password, function (error) {
            if (error) {
                toastr.error(error.reason, 'Login Denied');
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
    'click .verifyEmail': function (event) {
        event.preventDefault();
        var emails = getUnverifiedEmails();
        Meteor.call('sendVerificationEmails', emails, function (error, result) {
            if (error) {
                toastr.error(error.reason);
            } else {
                toastr.success('Verification link sent to: ' + emails);
            }
        });
    },
    'click .back-button': function (event) {
        event.preventDefault();
        history.back();
    }
});
