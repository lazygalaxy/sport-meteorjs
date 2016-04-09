Actors = new Mongo.Collection('actors');
Competitions = new Mongo.Collection('competitions');
Groups = new Mongo.Collection('groups');
Matches = new Mongo.Collection('matches');
Predictions = new Mongo.Collection('predictions');
Questions = new Mongo.Collection('questions');
Results = new Mongo.Collection('results');
UserInfo = new Mongo.Collection('userinfo');


//Predictions.allow({
//    update: function (userId, doc) {
//        return true;
//    },
//    insert: function (userId, doc) {
//        return true;
//    }
//});
