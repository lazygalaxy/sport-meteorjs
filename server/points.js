Meteor.startup(function () {
    calculatePoints = function (competitionId) {
        var matches = Matches.find({
            competitionId: competitionId,
            date: {
                $lt: new Date()
            }
        });

        var questions = Questions.find({
            competitionId: competitionId,
            date: {
                $lt: new Date()
            }
        });

        var predictionMap = Predictions.find({
            competitionId: competitionId
        }).fetch().reduce(function (map, obj) {
            if (!map[obj.userId]) {
                map[obj.userId] = {}
            }
            map[obj.userId][obj.itemId] = obj;
            return map;
        }, {});

        var resultMap = Results.find({
            competitionId: competitionId
        }).fetch().reduce(function (map, obj) {
            //TODO: consider the highest weighted here if multiple exists
            map[obj.itemId] = obj;
            return map;
        }, {});

        var infos = [];

        Object.keys(predictionMap).forEach(function (userId) {
            matches.forEach(function (match) {
                var info = {};
                info._id = match._id + '_' + userId;
                info.matchId = match._id;
                info.userId = userId;
                info.competitionId = competitionId;
                info.endDate = match.date;
                info.points = 0;

                var prediction = predictionMap[userId][match._id];
                if (prediction) {
                    info.predictionDate = prediction.date;
                }

                var result = resultMap[match._id];
                if (result) {
                    info.resultId = result._id;
                }

                if (prediction && result) {
                    //calculate the actual points
                    if (result.homeScore == prediction.homeScore && result.awayScore == prediction.awayScore) {
                        info.points = 3;
                    } else if ((result.homeScore - result.awayScore) == (prediction.homeScore - prediction.awayScore)) {
                        info.points = 2;
                    } else if ((result.homeScore > result.awayScore && prediction.awayScore > prediction.awayScore) || (result.homeScore < result.awayScore && prediction.awayScore < prediction.awayScore)) {
                        info.points = 1;
                    }
                }

                infos.push(info);
            });

            questions.forEach(function (question) {
                var info = {};
                info._id = question._id + '_' + userId;
                info.questionId = question._id;
                info.userId = userId;
                info.competitionId = competitionId;
                info.endDate = question.date;
                info.points = 0;

                var prediction = predictionMap[userId][question._id];
                if (prediction) {
                    info.predictionDate = prediction.date;
                }

                var result = resultMap[question._id];
                if (result) {
                    info.resultId = result._id;
                }

                if (prediction && result) {
                    if (question.optionType == 'INTEGER') {
                        if (Math.abs(result.answer - prediction.answer) <= question.threshold) {
                            info.points = question.points;
                        } else {
                            info.points = 0;
                        }
                    } else if (result.answer == prediction.answer) {
                        info.points = question.points;
                    }
                }

                infos.push(info);
            });
        });

        return infos;
    }

    calculateRankings = function (groupId, competitionId) {
        var allUserPoints = Points.find({
            competitionId: competitionId
        }).fetch();

        //return allUserPoints;

        var data = {};
        allUserPoints.forEach(function (userPointInfo) {
            var userInfo = UserInfo.findOne({
                _id: userPointInfo.userId
            });

            if (userInfo.groups.indexOf(groupId) > -1) {
                if (!data[userPointInfo.userId]) {
                    var user = Meteor.users.findOne({
                        _id: userPointInfo.userId
                    });

                    data[userPointInfo.userId] = {}
                    data[userPointInfo.userId].username = user.username;
                    data[userPointInfo.userId].avatar = 'avatar.png';
                    data[userPointInfo.userId].points = 0;
                }
                data[userPointInfo.userId].points += parseInt(userPointInfo.points);
                if (userPointInfo.predictionDate) {
                    if (!data[userPointInfo.userId].lastPredictionDate || data[userPointInfo.userId].lastPredictionDate < userPointInfo.predictionDate) {
                        data[userPointInfo.userId].lastPredictionDate = userPointInfo.predictionDate;
                    }
                }
            }
        });
        //return data;

        var dataArray = [];
        Object.keys(data).forEach(function (userId) {
            var userPoints = data[userId];
            dataArray.push(userPoints);
        });

        dataArray.sort(function (a, b) {
            if (a.points < b.points)
                return 1;
            else if (a.points > b.points)
                return -1;
            else if (a.lastPredictionDate < b.lastPredictionDate)
                return -1;
            else if (a.lastPredictionDate > b.lastPredictionDate)
                return 1;
            else
                return 0;
        });

        return dataArray;
    }

    //TODO: this should be removed at some point
    //Points.remove({});
    var competitions = Competitions.find({});
    competitions.forEach(function (competition) {
        var points = calculatePoints(competition._id);
        points.forEach(function (point) {
            Points.upsert({
                _id: point._id
            }, point);
        });
    });
    console.info('Points calculated!');
});
