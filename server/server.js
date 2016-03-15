Meteor.startup(function () {
    Meteor.publish("customusers", function () {
        var self = this;
        var handler = UserInfo.find({}).observeChanges({
            added: function (id, doc) {
                self.added('customusers', id, doc);
            },
            changed: function (id, doc) {
                self.changed('customusers', id, doc);
            },
            removed: function (id) {
                self.removed('customusers', id);
            }
        });

        var userInfoMap = UserInfo.find({}).fetch().reduce(function (map, obj) {
            map[obj._id] = obj;
            return map;
        }, {});
        Meteor.users.find({}).forEach(function (user) {
            for (var attrname in userInfoMap[user._id]) {
                user[attrname] = userInfoMap[user._id][attrname];
            }
            self.added('customusers', user._id, user);
        });

        self.ready();

        self.onStop(function () {
            if (handler) handler.stop();
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
