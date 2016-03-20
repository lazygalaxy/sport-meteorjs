Template.resultAdmin.helpers({
    getAnswerItems: function () {
        var currentUser = getCurrentUser();

        var matches = Matches.find({
            date: {
                $lt: new Date()
            },
            competition: {
                $in: currentUser.competitionAdmin
            }
        }, {
            sort: {
                date: -1
            }
        }).fetch();
        if (Meteor.user()) {
            var resultsMap = Results.find({
                userId: Meteor.user()._id
            }).fetch().reduce(function (map, obj) {
                map[obj.itemId] = obj;
                return map;
            }, {});

            matches.forEach(function (match) {
                if (match._id in resultsMap) {
                    match.homeScore = resultsMap[match._id].homeScore;
                    match.awayScore = resultsMap[match._id].awayScore;
                }
            });
        }
        return matches;
    }
});

Template.resultAdmin.events({
    "focusout": function (event) {
        if (event.target.value) {
            inputUpsertResult(event.target.id, event.target.name, event.target.value);
        }
    },
    "keyup": function (event) {
        if (event.which == 13 && event.target.value) {
            inputUpsertResult(event.target.id, event.target.name, event.target.value);
        }
    }
});

var inputUpsertResult = function (id, name, value) {
    Meteor.call('upsertResult', id, name, value, function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.info("update the results GUI here!!!");
        }
    });
}
