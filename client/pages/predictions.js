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
                match.homeScoreColor = '#ffffff';
                match.awayScoreColor = '#ffffff';

                if (match._id in predictionsMap) {
                    var prediction = predictionsMap[match._id];

                    match.homeScore = prediction.homeScore;
                    if (prediction.hasOwnProperty('homeScoreError')) {
                        if (prediction.homeScoreError) {
                            match.homeScoreColor = '#ff7777';
                        } else {
                            match.homeScoreColor = '#77ff77';
                        }
                    }

                    match.awayScore = prediction.awayScore;
                    if (prediction.hasOwnProperty('awayScoreError')) {
                        if (prediction.awayScoreError) {
                            match.awayScoreColor = '#ff7777';
                        } else {
                            match.awayScoreColor = '#77ff77';
                        }
                    }
                }
            });

            questions.forEach(function (question) {
                question.type = 'question';
                question.answerColor = '#ffffff';

                if (question._id in predictionsMap) {
                    var prediction = predictionsMap[question._id];
                    question.answer = prediction.answer;

                    if (prediction.hasOwnProperty('answerError')) {
                        if (prediction.answerError) {
                            question.answerColor = '#ff7777';
                        } else {
                            question.answerColor = '#77ff77';
                        }
                    }
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
        event.preventDefault();
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
