Meteor.startup(function () {
    Meteor.publish("actors", function () {
        return Actors.find({});
    });

    Meteor.publish("competitions", function () {
        return Competitions.find({});
    });

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

    Meteor.publish("groups", function () {
        var userInfo = UserInfo.findOne({
            _id: this.userId
        });

        if (userInfo) {
            var adminGroups = userInfo.adminGroups;
            if (!adminGroups) {
                adminGroups = [];
            }

            return Groups.find({
                $or: [{
                    _id: {
                        $in: userInfo.groups
                    }
            }, {
                    _id: {
                        $in: adminGroups
                    }
            }]
            });
        }
        return [];
    });

    Meteor.publish("matches", function () {
        return Matches.find({});
    });

    Meteor.publish("points", function () {
        return Points.find({});
    });

    Meteor.publish("predictions", function () {
        return Predictions.find({});
    });

    Meteor.publish("questions", function () {
        return Questions.find({});
    });

    Meteor.publish("results", function () {
        return Results.find({});
    });
});
