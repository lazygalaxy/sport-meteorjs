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
