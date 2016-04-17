//TODO: this repetition of events should be avoided
Template.userAdmin.events({
    "click .group-selection li a": function (event) {
        event.preventDefault();
        setSelectedGroup(false, event.target.id);
    },
    "click .competition-selection li a": function (event) {
        event.preventDefault();
        setSelectedCompetition(false, event.target.id);
    }
});

Template.rankings.events({
    "click .group-selection li a": function (event) {
        event.preventDefault();
        setSelectedGroup(false, event.target.id);
    },
    "click .competition-selection li a": function (event) {
        event.preventDefault();
        setSelectedCompetition(false, event.target.id);
    }
});

Template.points.events({
    "click .competition-selection li a": function (event) {
        event.preventDefault();
        setSelectedCompetition(false, event.target.id);
    },
    "click .user-selection li a": function (event) {
        event.preventDefault();
        setSelectedUser(event.target.id);
    }
});
