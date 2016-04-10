CustomUsers = new Mongo.Collection('customusers');

//subscribers
Meteor.subscribe("actors");
Meteor.subscribe("competitions");
Meteor.subscribe("customusers");
Meteor.subscribe("groups");
Meteor.subscribe("matches");
Meteor.subscribe("predictions");
Meteor.subscribe("questions");
Meteor.subscribe("results");
