Template.registerHelper('prettyDate', function (date) {
    return moment(date).format('D MMM YYYY - h:mm:ss a');
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('getActors', function (value, tokenizer, prefix) {
    var values = value.split(tokenizer);
    for (var i = 0; i < values.length; i++) {
        values[i] = prefix + '_' + values[i];
    }
    var actors = Actors.find({
        _id: {
            $in: values
        }
    });
    return actors;
});

Template.registerHelper('getActor', function (id) {
    var actor = Actors.findOne({
        _id: id
    });
    if (actor) {
        return actor;
    } else {
        return Actors.findOne({
            _id: 'CTRY_XYZ'
        });
    }
});

//users
Template.registerHelper('getUsers', function () {
    return CustomUsers.find({});
});

getUser = function (id) {
    return CustomUsers.findOne({
        _id: id
    });
}

getCurrentUser = function () {
    return getUser(Meteor.userId());
}

Template.registerHelper('getCurrentUser', function () {
    return getCurrentUser();
});

Template.registerHelper('hasPaid', function (id) {
    var user = CustomUsers.findOne({
        _id: id
    });
    if (user && user.hasOwnProperty(getPaidAttribute())) {
        return user[getPaidAttribute()];
    } else {
        return false;
    }
});

getPaidAttribute = function () {
    return "paid" + Session.get('selectedGroup') + Session.get('selectedCompetition');
}

Template.registerHelper('getPaidAttribute', function () {
    return getPaidAttribute();
});


//competitions
getCompetitions = function () {
    var competitions = [];
    var nowDate = new Date();

    Competitions.find({}).forEach(function (entry) {
        if (entry.endDate > nowDate || Predictions.findOne({
                userId: getCurrentUser()._id,
                competitionId: entry._id
            }) || Questions.findOne({
                userId: getCurrentUser()._id,
                competitionId: entry._id
            })) {
            competitions.push(entry);
        }
    });

    return competitions;
}

Template.registerHelper('getCompetitions', function () {
    return getCompetitions();
});

Template.registerHelper('getSelectedCompetition', function (checkAdmin) {
    setCompetition(checkAdmin);
    return Session.get('selectedCompetition');
});

Template.registerHelper('getAdminCompetitions', function () {
    return getCurrentUser().adminCompetitions;
});

//groups
Template.registerHelper('getGroups', function () {
    //TODO: should maybe also include groups that the user is an admin for
    return getCurrentUser().groups;
});

Template.registerHelper('getSelectedGroup', function (checkAdmin) {
    setGroup(checkAdmin);
    return Session.get('selectedGroup');
});

Template.registerHelper('getAdminGroups', function () {
    return getCurrentUser().adminGroups;
});

Template.registerHelper('getSelectedUser', function () {
    setUser();
    return Session.get('selectedUser');
});

inputUpsertPrediction = function (id, name, value) {
    Meteor.call('upsertPrediction', id, name, value, function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.info("update the predictions GUI here!!!");
        }
    });
}

inputUpsertResult = function (id, name, value) {
    Meteor.call('upsertResult', id, name, value, function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.info("update the results GUI here!!!");
        }
    });
}

//TODO: this repetition of events should be avoided
Template.userAdmin.events({
    "click .group-selection li a": function (event) {
        Session.set('selectedGroup', event.target.text);
    },
    "click .competition-selection li a": function (event) {
        Session.set('selectedCompetition', event.target.text);
    }
});

Template.standings.events({
    "click .group-selection li a": function (event) {
        Session.set('selectedGroup', event.target.text);
    },
    "click .competition-selection li a": function (event) {
        Session.set('selectedCompetition', event.target.text);
    }
});

Template.points.events({
    "click .competition-selection li a": function (event) {
        Session.set('selectedCompetition', event.target.text);
    },
    "click .user-selection li a": function (event) {
        Session.set('selectedUser', getUser(event.target.id));
    }
});

var setCompetition = function (checkAdmin) {
    //ensure that a competition is set
    if (!Session.get('selectedCompetition')) {
        //TODO: should not be hardcoded to EURO2016
        Session.set('selectedCompetition', 'EURO2016');
    }

    //if it is required ensure it is an admin group
    if (checkAdmin && getCurrentUser().adminCompetitions.indexOf(Session.get('selectedCompetition')) == -1) {
        var competitionLength = getCurrentUser().adminCompetitions.length;
        Session.set('selectedCompetition', getCurrentUser().adminCompetitions[0]);
    }
}

var setGroup = function (checkAdmin) {
    //ensure that a group is set
    if (!Session.get('selectedGroup')) {
        var groupLength = getCurrentUser().groups.length;
        Session.set('selectedGroup', getCurrentUser().groups[groupLength - 1]);
    }

    //if it is required ensure it is an admin group
    if (checkAdmin && getCurrentUser().adminGroups.indexOf(Session.get('selectedGroup')) == -1) {
        var groupLength = getCurrentUser().adminGroups.length;
        Session.set('selectedGroup', getCurrentUser().adminGroups[groupLength - 1]);
    }
}

setUser = function (id) {
    //ensure that a user is set
    if (!Session.get('selectedUser')) {
        Session.set('selectedUser', getCurrentUser());
    }

    if (id) {
        Session.set('selectedUser', getUser(id));
    }
}
