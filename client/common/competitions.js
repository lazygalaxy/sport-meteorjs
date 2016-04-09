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
