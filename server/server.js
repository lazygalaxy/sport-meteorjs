//methods
Meteor.methods({
    //upserts a prediction based on the id of a question and the name and value provided
    'upsertPrediction': function (question_id, name, value) {
        if (Meteor.user()) {
            var obj = {};
            obj[name] = value;
            obj['date'] = new Date();
            obj['question_id'] = question_id;
            obj['user_id'] = Meteor.user()._id;
            predictions.upsert({
                _id: question_id + '_' + Meteor.user()._id
            }, {
                $set: obj
            });
        }
    }
});
