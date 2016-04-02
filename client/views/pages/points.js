Template.points.helpers({
    getUserPoints: function () {
        var competition = Session.get('selectedCompetition');
        var user = Session.get('selectedUser');

        var matches = Matches.find({
            competitionId: competition,
            date: {
                $lt: new Date()
            }
        });

        var questions = Questions.find({
            competitionId: competition,
            date: {
                $lt: new Date()
            }
        });

        var predictionMap = Predictions.find({
            userId: user._id,
            competitionId: competition
        }).fetch().reduce(function (map, obj) {
            map[obj.itemId] = obj;
            return map;
        }, {});

        var resultMap = Results.find({
            competitionId: competition
        }).fetch().reduce(function (map, obj) {
            //TODO: consider the highest weighted here if multiple exists
            map[obj.itemId] = obj;
            return map;
        }, {});

        var infos = [];
        matches.forEach(function (match) {
            var prediction = predictionMap[match._id];
            var result = resultMap[match._id];

            var info = {};
            info.endDate = match.date;
            info.matchOrQuestion = match.homeTeam.label + ' vs ' + match.awayTeam.label;
            info.points = '-';

            if (result) {
                info.result = result.homeScore + ' - ' + result.awayScore;
            } else {
                info.result = 'Pending';
            }

            if (prediction) {
                info.predictDate = prettyDate(prediction.date);
                info.prediction = prediction.homeScore + ' - ' + prediction.awayScore + ' (' + prettyDate(prediction.date) + ')';
            } else {
                info.predictDate = 'N/A';
                info.prediction = 'N/A';
                info.points = '0';
            }

            if (prediction && result) {
                //calculate the actual points
                if (result.homeScore == prediction.homeScore && result.awayScore == prediction.awayScore) {
                    info.points = 3;
                } else if ((result.homeScore - result.awayScore) == (prediction.homeScore - prediction.awayScore)) {
                    info.points = 2;
                } else if ((result.homeScore > result.awayScore && prediction.awayScore > prediction.awayScore) || (result.homeScore < result.awayScore && prediction.awayScore < prediction.awayScore)) {
                    info.points = 1;
                } else {
                    info.points = 0;
                }
            }

            infos.push(info);
        });

        questions.forEach(function (question) {
            var prediction = predictionMap[question._id];
            var result = resultMap[question._id];

            var info = {};
            info.endDate = question.date;
            info.matchOrQuestion = question.description;
            info.points = '-';

            if (result) {
                info.result = result.answer;
            } else {
                info.result = 'Pending';
            }

            if (prediction) {
                info.predictDate = prettyDate(prediction.date);
                info.prediction = prediction.answer;
            } else {
                info.predictDate = 'N/A';
                info.prediction = 'N/A';
                info.points = '0';
            }

            if (prediction && result) {
                if (question.options == 'INTEGER') {
                    if (Math.abs(result.answer - prediction.answer) <= question.threshold) {
                        info.points = question.points;
                    } else {
                        info.points = 0;
                    }
                } else if (result.answer == prediction.answer) {
                    info.points = question.points;
                } else {
                    info.points = 0;
                }
            }

            infos.push(info);
        });

        infos.sort(function (a, b) {
            if (a.endDate < b.endDate)
                return 1;
            else if (a.endDate > b.endDate)
                return -1;
            else
                return 0;
        });

        return infos;
    }
});
