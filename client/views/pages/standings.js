Template.standings.helpers({
    getUsers: function () {
        var competitionId = "EURO2016TEST";
        //var users = CustomUsers.find({});

        var predictionMap = Predictions.find({
            competitionId: competitionId
        }).fetch().reduce(function (map, obj) {
            if (!map[obj.userId]) {
                map[obj.userId] = {}
            }
            map[obj.userId][obj._id] = obj;
            return map;
        }, {});

        var resultMap = Results.find({
            competitionId: competitionId
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
            user.points = 0;

            //console.info("calculating user " + user.username);
            Object.keys(predictionMap[userId]).forEach(function (predictionId) {
                var prediction = predictionMap[userId][predictionId];
                //console.info("calculating prediction " + JSON.stringify(prediction));
                if (resultMap[prediction.itemId]) {
                    var result = resultMap[prediction.itemId];
                    if (result && prediction) {
                        //console.log("calculating " + prediction.itemId);
                        if (result.homeScore == prediction.homeScore && result.awayScore == prediction.awayScore) {
                            user.points += 3;
                        } else if ((result.homeScore - result.awayScore) == (prediction.homeScore - prediction.awayScore)) {
                            user.points += 2;
                        } else if ((result.homeScore > result.awayScore && prediction.awayScore > prediction.awayScore) || (result.homeScore < result.awayScore && prediction.awayScore < prediction.awayScore)) {
                            user.points += 1;
                        }
                    }
                }
            });

            users.push(user);
        });

        return users;
    }
});
