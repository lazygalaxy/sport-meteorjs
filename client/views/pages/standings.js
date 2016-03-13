Template.standings.helpers({
    getPredictions: function () {
        /*
        var predictionsMap = predictions.find({
            user_id: Meteor.user()._id
        }).fetch().reduce(function (map, obj) {
            map[obj.question_id] = obj;
            return map;
        }, {});

        return predictionsMap;
        */
        return ['1', '2', '3', '4'];
    }
});
