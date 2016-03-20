Template.registerHelper('prettyDate', function (date) {
    return moment(date);
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

Template.registerHelper('getSelectedAdminGroup', function () {
    return Session.get('selectedAdminGroup');
});

//TODO: this needs to be more generic
Template.userAdmin.events({
    "click .admin-group-selection li a": function (event) {
        Session.set('selectedAdminGroup', event.target.text);
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
