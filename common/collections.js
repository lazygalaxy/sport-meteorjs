participants = new Meteor.Collection('participants');
questions = new Meteor.Collection('questions');
predictions = new Meteor.Collection('predictions');
answers = new Meteor.Collection('answers');

//predictions.allow({
//    update: function (userId, doc) {
//        return true;
//    },
//    insert: function (userId, doc) {
//        return true;
//    }
//});
