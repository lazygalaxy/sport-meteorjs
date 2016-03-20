UserInfo = new Mongo.Collection('userinfo');
Competitions = new Mongo.Collection('competitions');
Groups = new Mongo.Collection('groups');
Actors = new Mongo.Collection('actors');
Matches = new Mongo.Collection('matches');
Questions = new Mongo.Collection('questions');
Results = new Mongo.Collection('results');
Predictions = new Mongo.Collection('predictions');

//Predictions.allow({
//    update: function (userId, doc) {
//        return true;
//    },
//    insert: function (userId, doc) {
//        return true;
//    }
//});
