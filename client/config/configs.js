//subscriptions
Meteor.subscribe("allUsers");

//accounts
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});
