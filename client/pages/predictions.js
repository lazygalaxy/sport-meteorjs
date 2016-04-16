Template.predictions.helpers({
    getPredictionItems: function () {
        var questions = Questions.find({
            date: {
                $gt: new Date()
            }
        }).fetch();

        var matches = Matches.find({
//            "homeTeam.iso3": {
//                $ne: 'XYZ'
//            },
//            "awayTeam.iso3": {
//                $ne: 'XYZ'
//            },
            date: {
                $gt: new Date()
            }
        }).fetch();

        if (Meteor.user()) {
            var predictionsMap = Predictions.find({
                userId: Meteor.user()._id
            }).fetch().reduce(function (map, obj) {
                map[obj.itemId] = obj;
                return map;
            }, {});

            matches.forEach(function (match) {
                match.type = 'match';
                if (match._id in predictionsMap) {
                    match.homeScore = predictionsMap[match._id].homeScore;
                    match.awayScore = predictionsMap[match._id].awayScore;
                }
            });

            questions.forEach(function (question) {
                question.type = 'question';
                if (question._id in predictionsMap) {
                    question.answer = predictionsMap[question._id].answer;
                }
            });
        }

        var predictionItems = questions.concat(matches);

        predictionItems.sort(function (a, b) {
            if (a.date < b.date)
                return -1;
            else if (a.date > b.date)
                return 1;
            else if (a.type > b.type)
                return -1;
            else if (a.type < b.type)
                return 1;
            else if (a._id < b._id)
                return -1;
            else if (a._id > b._id)
                return 1;
            else
                return 0;
        });

        return predictionItems;
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
    },
    "click .answer-selection li a": function (event) {
        var itemId = event.target.parentNode.id;
        var answer = event.target.id;
        inputUpsertPrediction(itemId, 'answer', answer);
    }
});
