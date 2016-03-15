//client mongodbs
CustomUsers = new Mongo.Collection('customusers');

//subscriptions
Meteor.subscribe("customusers");

//accounts
Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
});
