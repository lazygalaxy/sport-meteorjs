Meteor.startup(function () {
    //listeners
    Meteor.users.find({}).observeChanges({
        added: function (id, doc) {
            //TODO: find a better way to add users to groups
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
                    UserInfo.upsert({
                        _id: id,
                    }, {
                        $addToSet: {
                            groups: group._id
                        }
                    });
                }
            });
        }
    });

    //publishers
    Meteor.publish("customusers", function () {
        var self = this;
        var userInfoHandler = UserInfo.find({}).observeChanges({
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

        var meteorUserHandler = Meteor.users.find({}).observeChanges({
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

        //alert subscribers publisher is ready
        self.ready();

        self.onStop(function () {
            if (userInfoHandler) {
                userInfoHandler.stop();
            }

            if (meteorUserHandler) {
                meteorUserHandler.stop();
            }
        });
    });

    //methods
    Meteor.methods({
        'upsertPrediction': function (itemId, name, value) {
            if (Meteor.user()) {
                if ((name == 'homeScore' || name == 'awayScore') && ((value % 1 != 0) || value < 0 || value > 9)) {
                    throw new Meteor.Error(500, 'Integer value between 0 and 9 expected.');
                }

                var prediction = Predictions.findOne({
                    _id: itemId + '_' + Meteor.user()._id
                });
                if (!prediction || !prediction.hasOwnProperty(name) || prediction[name] != value) {
                    var obj = {};
                    obj[name] = value;
                    obj['date'] = new Date();
                    obj['itemId'] = itemId;
                    obj['competitionId'] = itemId.split('_')[0];
                    obj['userId'] = Meteor.user()._id;
                    Predictions.upsert({
                        _id: itemId + '_' + Meteor.user()._id
                    }, {
                        $set: obj
                    });

                    return value;
                }
            }
        },
        'upsertResult': function (itemId, name, value) {
            if (Meteor.user()) {
                var obj = {};
                obj[name] = value;
                obj['date'] = new Date();
                obj['itemId'] = itemId;
                obj['competitionId'] = itemId.split('_')[0];
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
        },
        'changeUsername': function (username) {
            Accounts.setUsername(Meteor.user()._id, username);
        }
    });
});
