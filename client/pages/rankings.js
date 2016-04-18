Template.rankings.helpers({
    getCompetitionUsers: function () {
        var competition = Session.get('selectedCompetition');
        var group = Session.get('selectedGroup');
        var nowDate = new Date();

        var predictionMap = Predictions.find({
            competitionId: competition._id
        }).fetch().reduce(function (map, obj) {
            if (!map[obj.userId]) {
                map[obj.userId] = {}
            }
            map[obj.userId][obj._id] = obj;
            return map;
        }, {});

        var resultMap = Results.find({
            competitionId: competition._id
        }).fetch().reduce(function (map, obj) {
            //TODO: consider the highest weighted here if multiple exists
            map[obj.itemId] = obj;
            return map;
        }, {});

        var users = [];
        Object.keys(predictionMap).forEach(function (userId) {
            var user = CustomUsers.findOne({
                _id: userId
            });
            if (!group.paid || user.emails[0].verified) {
                //if the user belongs to the selected group
                if (user.groups.indexOf(group._id) >= 0) {
                    user.points = 0;
                    Object.keys(predictionMap[userId]).forEach(function (predictionId) {
                        var prediction = predictionMap[userId][predictionId];
                        if (!user.date || user.date < prediction.date) {
                            user.date = prediction.date;
                        }

                        //if there is an actual result then calculate the points accordingly
                        if (resultMap[prediction.itemId]) {
                            var result = resultMap[prediction.itemId];
                            if (result.answer) {
                                var question = Questions.findOne({
                                    _id: prediction.itemId
                                });
                                if (question.date < nowDate) {
                                    if (question.optionType == 'INTEGER') {
                                        if (Math.abs(result.answer - prediction.answer) <= question.threshold) {
                                            user.points += parseInt(question.points);
                                        }
                                    } else if (result.answer == prediction.answer) {
                                        user.points += parseInt(question.points);
                                    }
                                }
                            } else {
                                var match = Matches.findOne({
                                    _id: prediction.itemId
                                });
                                if (match.date < nowDate) {
                                    //calculate the actual points
                                    if (result.homeScore == prediction.homeScore && result.awayScore == prediction.awayScore) {
                                        user.points += 3;
                                    } else if ((result.homeScore - result.awayScore) == (prediction.homeScore - prediction.awayScore)) {
                                        user.points += 2;
                                    } else if ((result.homeScore > result.awayScore && prediction.awayScore > prediction.awayScore) || (result.homeScore < result.awayScore && prediction.awayScore < prediction.awayScore)) {
                                        user.points += 1;
                                    }
                                }
                            }
                        }
                    });
                    users.push(user);
                }
            }
        });


        users.sort(function (a, b) {
            if (a.points < b.points)
                return 1;
            else if (a.points > b.points)
                return -1;
            else if (a.date < b.date)
                return -1;
            else if (a.date > b.date)
                return 1;
            else
                return 0;
        });

        var rank = 1;
        var points = Number.POSITIVE_INFINITY;
        users.forEach(function (user) {
            if (user.points == points) {
                user.rank = '-';
            } else {
                user.rank = rank++;
                points = user.points;
            }
        });

        return users;
    }
});

Template.rankings.events({
    "click .user-selection a": function (event) {
        event.preventDefault();
        setSelectedUser(event.target.id);
    }
});
