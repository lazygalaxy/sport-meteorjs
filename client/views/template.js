Template.registerHelper('prettyDate', function (date) {
    return moment(date);
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
getCurrentUser = function () {
    return CustomUsers.findOne({
        _id: Meteor.userId()
    });
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
    return Competitions.find({});
}

Template.registerHelper('getCompetitions', function () {
    return getCompetitions();
});

Template.registerHelper('getSelectedCompetition', function () {
    return Session.get('selectedCompetition');
});

Template.registerHelper('getAdminCompetitions', function () {
    return getCurrentUser().adminCompetitions;
});

//groups
Template.registerHelper('getGroups', function () {
    return getCurrentUser().groups;
});

Template.registerHelper('getSelectedGroup', function () {
    return Session.get('selectedGroup');
});

Template.registerHelper('getAdminGroups', function () {
    return getCurrentUser().adminGroups;
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
