//client mongodbs
CustomUsers = new Mongo.Collection('customusers');

//subscriptions
Meteor.subscribe("actors");
Meteor.subscribe("competitions");
Meteor.subscribe("customusers");
Meteor.subscribe("groups");
Meteor.subscribe("matches");
Meteor.subscribe("predictions");
Meteor.subscribe("results");
Meteor.subscribe("questions");
