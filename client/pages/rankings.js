Template.rankings.helpers({
	getCompetitionUsers: function () {
		var competition = Session.get('selectedCompetition');
		var group = Session.get('selectedGroup');
		var isPaid = isSelectedPaid();

		return calculateRankings(group._id, competition._id, isPaid);
	}
});

Template.rankings.events({
	"click .user-selection": function (event) {
		setSelectedUser(event.target.id);
	}
});

setSelectedPaid = function (id = null) {

	if (id) {
		Session.set('selectedPaid', getActor(id));
	}

	if (!Session.get('selectedPaid')) {
		if (paidButtonVisible()) {
			Session.set('selectedPaid', getActor('OTHER_PAID'));
		} else {
			Session.set('selectedPaid', getActor('OTHER_ALL'));
		}
	}
}

Template.registerHelper('getSelectedPaid', function () {
	return Session.get('selectedPaid');
});

isSelectedPaid = function () {
	return Session.get('selectedPaid')._id == 'OTHER_PAID';
}

Template.registerHelper('isSelectedPaid', function () {
	return isSelectedPaid();
});
