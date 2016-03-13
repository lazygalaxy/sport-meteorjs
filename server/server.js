Meteor.startup(function () {
    Meteor.publish("allUsers", function () {
        return Meteor.users.find();
    });
});

//methods
Meteor.methods({
    'upsertPrediction': function (itemId, name, value) {

        if (Meteor.user()) {
            var obj = {};
            obj[name] = value;
            obj['date'] = new Date();
            obj['itemId'] = itemId;
            obj['userId'] = Meteor.user()._id;
            Predictions.upsert({
                _id: itemId + '_' + Meteor.user()._id
            }, {
                $set: obj
            });
        }
    },
    'upsertResult': function (itemId, name, value) {
        if (Meteor.user()) {
            var obj = {};
            obj[name] = value;
            obj['date'] = new Date();
            obj['itemId'] = itemId;
            obj['userId'] = Meteor.user()._id;
            Results.upsert({
                _id: itemId + '_' + Meteor.user()._id
            }, {
                $set: obj
            });
        }
    },
    'upsertUserInfo': function (userId, name, value) {
        var obj = {};
        obj[name] = value;
        UserInfo.upsert({
            _id: userId
        }, {
            $set: obj
        });
    }
});
