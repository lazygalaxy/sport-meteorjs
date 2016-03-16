Template.predictions.helpers({
    getPredictionItems: function () {
        //TODO: get the matches for the competition
        var matches = Matches.find({}, {
            sort: {
                date: 1
            }
        }).fetch();
        if (Meteor.user()) {
            //TODO: get the user predictions
            var predictionsMap = Predictions.find({
                userId: Meteor.user()._id
            }).fetch().reduce(function (map, obj) {
                map[obj.itemId] = obj;
                return map;
            }, {});

            matches.forEach(function (match) {
                if (match._id in predictionsMap) {
                    match.homeScore = predictionsMap[match._id].homeScore;
                    match.awayScore = predictionsMap[match._id].awayScore;
                }
            });
        }
        return matches;
    }
});

Template.predictions.events({
    "focusout": function (event) {
        if (event.target.value) {
            inputUpsertPrediction(event.target.id, event.target.name, event.target.value);
        }
    },
    "keyup": function (event) {
        if (event.which == 13 && event.target.value) {
            inputUpsertPrediction(event.target.id, event.target.name, event.target.value);
        }
    }
});

var inputUpsertPrediction = function (id, name, value) {
    Meteor.call('upsertPrediction', id, name, value, function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.info("updtae the predictions GUI here!!!");
        }
    });
}
