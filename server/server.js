Meteor.startup(function () {
    Meteor.publish("allUsers", function () {
        var users = Meteor.users.find({});

        //        var userInfoMap = UserInfo.find({}).fetch().reduce(function (map, obj) {
        //            map[obj._id] = obj;
        //            return map;
        //        }, {});
        //
        //        users.forEach(function (user) {
        //            if (user._id in userInfoMap) {
        //                for (var attrname in userInfoMap[user._id]) {
        //                    user[attrname] = userInfoMap[user._id][attrname];
        //                }
        //            }
        //        });

        return users;
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
        'upsertUser': function (userId, name, value) {
            var obj = {};
            obj[name] = value;
            UserInfo.upsert({
                _id: userId
            }, {
                $set: obj
            });
        }
    });
});
