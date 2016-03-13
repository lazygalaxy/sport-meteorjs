//methods
Meteor.methods({
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
    },
    'upsertAnswer': function (question_id, name, value) {
        if (Meteor.user()) {
            var obj = {};
            obj[name] = value;
            obj['date'] = new Date();
            obj['question_id'] = question_id;
            obj['user_id'] = Meteor.user()._id;
            answers.upsert({
                _id: question_id + '_' + Meteor.user()._id
            }, {
                $set: obj
            });
        }
    }
});
