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

	competitions.sort(function (a, b) {
		if (a.label < b.label)
			return -1;
		else if (a.label > b.label)
			return 1;
		else
			return 0;
	});

	return competitions;
}

Template.registerHelper('getCompetitions', function () {
	return getCompetitions();
});

setSelectedCompetition = function (checkAdmin, id = null) {
	var oldCompetitionId;
	if (Session.get('selectedCompetition')) {
		oldCompetitionId = Session.get('selectedCompetition')._id;
	}

	var newCompetitonId = oldCompetitionId;
	if (id && getCompetition(id)) {
		newCompetitonId = id;
	}

	var currentUser = getCurrentUser();
	//chech if it is an admin competition if required
	if (checkAdmin && currentUser.adminCompetitions.indexOf(newCompetitonId) == -1) {
		newCompetitonId = currentUser.adminCompetitions[0];
	}

	if (newCompetitonId && newCompetitonId != oldCompetitionId && getCompetition(newCompetitonId)) {
		// if there is valid newCompetitonId
		Session.set('selectedCompetition', getCompetition(newCompetitonId));

	} else if (!oldCompetitionId || !getCompetition(oldCompetitionId)) {
		// if there is no oldCompetitionId or the oldCompetitionId is invalid
		Session.set('selectedCompetition', getCompetitions()[0]);
	}
}

Template.registerHelper('getSelectedCompetition', function () {
	return Session.get('selectedCompetition');
});
