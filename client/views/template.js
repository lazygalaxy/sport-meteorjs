// ---------- general helpers ----------
prettyDate = function (date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

Template.registerHelper('prettyDate', function (date) {
    return prettyDate(date);
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('gtLength1', function (array) {
    return array.length > 1;
});

// ---------- actor helpers ----------
getActor = function (id) {
    return Actors.findOne({
        _id: id
    });
}

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
    var actor = getActor(id);
    if (actor) {
        return actor;
    } else {
        return getActor('CTRY_XYZ');
    }
});

// ---------- user helpers ----------
getUser = function (id) {
    return CustomUsers.findOne({
        _id: id
    });
}

Template.registerHelper('getUsers', function () {
    return CustomUsers.find({});
});

getCurrentUser = function () {
    return getUser(Meteor.userId());
}

Template.registerHelper('getCurrentUser', function () {
    return getCurrentUser();
});

setSelectedUser = function (id = null) {
    if (id) {
        Session.set('selectedUser', getUser(id));
    }

    if (!Session.get('selectedUser')) {
        Session.set('selectedUser', getCurrentUser());
    }
}

Template.registerHelper('getSelectedUser', function () {
    return Session.get('selectedUser');
});

Template.registerHelper('hasPaid', function (id) {
    var user = getUser(id);
    if (user && user.hasOwnProperty(getPaidAttribute())) {
        return user[getPaidAttribute()];
    } else {
        return false;
    }
});

getPaidAttribute = function () {
    return "paid" + Session.get('selectedGroup')._id + Session.get('selectedCompetition')._id;
}

Template.registerHelper('getPaidAttribute', function () {
    return getPaidAttribute();
});


// ---------- competition helpers ----------
getCompetition = function (id) {
    return Competitions.findOne({
        _id: id
    });
}

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

setSelectedCompetition = function (checkAdmin, id = null) {
    if (id) {
        Session.set('selectedCompetition', getCompetition(id));
    }

    //ensure that a competition is set
    if (!Session.get('selectedCompetition')) {
        //TODO: should not be hardcoded to EURO2016
        Session.set('selectedCompetition', getCompetition('EURO2016'));
    }

    //if it is required ensure it is an admin group
    if (checkAdmin && getCurrentUser().adminCompetitions.indexOf(Session.get('selectedCompetition')) == -1) {
        var currentUser = getCurrentUser();
        var competitionLength = currentUser.adminCompetitions.length;
        Session.set('selectedCompetition', getCompetition(currentUser.adminCompetitions[0]));
    }
}

Template.registerHelper('getSelectedCompetition', function () {
    return Session.get('selectedCompetition');
});

// ---------- group helpes ----------
getGroup = function (id) {
    return Groups.findOne({
        _id: id
    });
}

Template.registerHelper('getGroups', function () {
    //TODO: should maybe also include groups that the user is an admin for
    return Groups.find({
        _id: {
            $in: getCurrentUser().groups
        }
    }).fetch();
});

Template.registerHelper('getSelectedGroup', function () {
    return Session.get('selectedGroup');
});

Template.registerHelper('getAdminGroups', function () {
    return Groups.find({
        _id: {
            $in: getCurrentUser().adminGroups
        }
    }).fetch();
});

setSelectedGroup = function (checkAdmin, id = null) {
    var oldGroupId;
    if (Session.get('selectedGroup')) {
        oldGroupId = Session.get('selectedGroup')._id;
    }

    var newGroupId = oldGroupId;
    if (getGroup(id)) {
        newGroupId = getGroup(id)._id;
    }

    var currentUser = getCurrentUser();
    //if it is required ensure it is an admin group
    if (checkAdmin && currentUser.adminGroups.indexOf(newGroupId) == -1) {
        var groupLength = currentUser.adminGroups.length;
        newGroupId = currentUser.adminGroups[groupLength - 1];
    }

    if (!newGroupId && !oldGroupId) {
        // there is no new or old group ids, a default needs to be set
        var groupLength = currentUser.groups.length;
        Session.set('selectedGroup', getGroup(currentUser.groups[groupLength - 1]));
    } else if (newGroupId != oldGroupId) {
        Session.set('selectedGroup', getGroup(newGroupId));
    }
}

// ---------- server calls ----------
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

// ---------- events ----------
//TODO: this repetition of events should be avoided
Template.userAdmin.events({
    "click .group-selection li a": function (event) {
        setSelectedGroup(false, event.target.id);
    },
    "click .competition-selection li a": function (event) {
        setSelectedCompetition(false, event.target.id);
    }
});

Template.standings.events({
    "click .group-selection li a": function (event) {
        setSelectedGroup(false, event.target.id);
    },
    "click .competition-selection li a": function (event) {
        setSelectedCompetition(false, event.target.id);
    }
});

Template.points.events({
    "click .competition-selection li a": function (event) {
        setSelectedCompetition(false, event.target.id);
    },
    "click .user-selection li a": function (event) {
        setSelectedUser(event.target.id);
    }
});
