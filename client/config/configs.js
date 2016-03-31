//client mongodbs
CustomUsers = new Mongo.Collection('customusers');

//subscriptions
Meteor.subscribe("customusers");
