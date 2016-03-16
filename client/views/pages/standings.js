Template.standings.helpers({
    getUsers: function () {
        var competitionId = "EURO2016TEST";
        //var users = CustomUsers.find({});

        var predictionMap = Predictions.find({
            competitionId: competitionId
        }).fetch().reduce(function (map, obj) {
            if (~map[obj.userId]) {
                map[obj.userId] = {}
            }
            map[obj.userId][obj._id] = obj;
            return map;
        }, {});

        var resultMap = Results.find({
            competitionId: competitionId
        }).fetch().reduce(function (map, obj) {
            if (~map[obj.userId]) {
                map[obj.userId] = {}
            }
            map[obj.userId][obj._id] = obj;
            return map;
        }, {});

        var users = [];
        Object.keys(predictionMap).forEach(function (userKey) {
            var user = CustomUsers.findOne({
                _id: userKey
            });
            user['points'] = 0;

            Object.keys(predictionMap[userKey]).forEach(function (predictionKey) {
                var prediction = predictionMap[userKey][predictionKey];
                if (resultMap[userKey]) {
                    var result = resultMap[userKey][prediction.itemKey];
                    if (result && prediction) {
                        if (result.homeScore == prediction.homeScore && result.awayScore == prediction.awayScore) {
                            user['points'] += 3;
                        }
                    }
                }
            });

            users.push(user);
        });

        return users;
    }
});
