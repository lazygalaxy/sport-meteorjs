Meteor.startup(function () {
    //listeners
    Meteor.users.find({}).observeChanges({
        added: function (id, doc) {
            console.log("adding " + doc.username);
            //TODO: must be a better way to do this
            var groups = Groups.find({});
            groups.forEach(function (group) {
                var found = (group._id == 'GLOBAL');
                group.domains.forEach(function (domain) {
                    doc.emails.forEach(function (email) {
                        if (email.address.endsWith(domain)) {
                            found = true;
                        }
                    });
                });
                if (found) {
                    Groups.upsert({
                        _id: group._id,
                    }, {
                        $addToSet: {
                            users: id
                        }
                    });
                }
            });
        }
    });

    //publishers
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
