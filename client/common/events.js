//TODO: this repetition of events should be avoided
Template.userAdmin.events({
	"click .group-selection li": function (event) {
		event.preventDefault();
		setSelectedGroup(false, event.target.id);
	},
	"click .competition-selection li": function (event) {
		event.preventDefault();
		setSelectedCompetition(false, event.target.id);
	}
});

Template.rankings.events({
	"click .group-selection": function (event) {
		event.preventDefault();
		setSelectedPaid('OTHER_ALL');
		setSelectedGroup(false, event.target.id);
	},
	"click .competition-selection": function (event) {
		event.preventDefault();
		setSelectedPaid('OTHER_ALL');
		setSelectedCompetition(false, event.target.id);
	},
	"click .paid-selection": function (event) {
		event.preventDefault();
		setSelectedPaid(event.target.id);
	}
});

Template.points.events({
	"click .competition-selection li": function (event) {
		event.preventDefault();
		setSelectedCompetition(false, event.target.id);
	},
	"click .user-selection li": function (event) {
		event.preventDefault();
		setSelectedUser(event.target.id);
	}
});
