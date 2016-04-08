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
                var validation = validateValue(itemId, name, value);
                value = validation[0];

                var nowDate = new Date();
                if (nowDate > validation[1]) {
                    throw new Meteor.Error(500, 'Prediction item has expired.');
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
                    return validation[2];
                }
            }
        },
        'upsertResult': function (itemId, name, value) {
            if (Meteor.user()) {
                var validation = validateValue(itemId, name, value);
                value = validation[0];

                var result = Results.findOne({
                    _id: itemId + '_' + Meteor.user()._id
                });
                if (!result || !result.hasOwnProperty(name) || result[name] != value) {
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
                    return validation[2];
                }
            }
        },
        'upsertUser': function (userId, name, value) {
            var user = Meteor.users.findOne({
                _id: userId
            });

            if (user) {
                var obj = {};
                obj[name] = value;
                UserInfo.upsert({
                    _id: userId
                }, {
                    $set: obj
                });

                return 'Updated ' + user.username + ' to ' + value + '.';
            } else {
                throw new Meteor.Error(500, 'User not found ' + userId + '.');
            }
        },
        'changeUsername': function (username) {
            Accounts.setUsername(Meteor.user()._id, username);
        }
    });

    var validateValue = function (itemId, name, value) {
        value = value.trim();

        var message = '';
        var predictionEndDate;

        var match = Matches.findOne({
            _id: itemId
        });
        if (match) {
            if (!value || (value % 1 != 0) || value < 0 || value > 9) {
                throw new Meteor.Error(500, 'Invalid value entered ' + value + '. Integer values between 0 and 9 expected.');
            }
            value = parseInt(value);
            predictionEndDate = match.date;
            if (name == 'homeScore') {
                message = match.homeTeam.label + ' score set to ' + value + '.';
            } else if (name == 'awayScore') {
                message = match.awayTeam.label + ' score set to ' + value + '.';
            }
        } else {
            var question = Questions.findOne({
                _id: itemId
            });
            if (question) {
                if (question.options == 'INTEGER') {
                    if (!value || (value % 1 != 0) || value < 0 || value > 999) {
                        throw new Meteor.Error(500, 'Invalid value entered ' + value + '. Integer values between 0 and 999 expected.');
                    }
                    value = parseInt(value);
                }
                predictionEndDate = question.date;
                message = question.description + ' Answer set to ' + value + '.';
            } else {
                throw new Meteor.Error(500, 'Prediction item not found ' + itemId + '.');
            }
        }

        return [value, predictionEndDate, message];
    }
});
