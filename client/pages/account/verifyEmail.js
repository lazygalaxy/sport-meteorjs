getUnverifiedEmails = function () {
	var currentUser = getCurrentUser();
	var emails = [];
	if (currentUser) {
		currentUser.emails.forEach(function (email) {
			if (!email.verified) {
				emails.push(email.address);
			}
		});
	}
	return emails;
};

Template.registerHelper('getUnverifiedEmails', function () {
	return getUnverifiedEmails();
});

verifyEmail = function (verifyEmailToken) {
	Accounts.verifyEmail(verifyEmailToken, function (error) {
		if (error) {
			toastr.error(error.reason);
		} else {
			toastr.success('Your email has been verified.');
			Router.go('home');
		}
	});
}
