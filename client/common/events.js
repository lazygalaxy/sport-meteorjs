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
