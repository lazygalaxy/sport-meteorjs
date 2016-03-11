Template.predictions.helpers({
    getQuestions: function () {
        var predictionsMap = predictions.find({}).fetch().reduce(function (map, obj) {
            map[obj._id] = obj;
            return map;
        }, {});

        var theQuestions = questions.find({}).fetch();
        theQuestions.forEach(function (line) {
            if (line._id in predictionsMap) {
                line.home_score = predictionsMap[line._id].home_score;
                line.away_score = predictionsMap[line._id].away_score;
            }
        });

        return theQuestions;
    }
});

Template.predictions.events({
    "focusout": function (event) {
        if (event.target.value) {
            inputUpdateScore(event.target.id, event.target.name, event.target.value);
        }
    },
    "keyup": function (event) {
        if (event.which == 13 && event.target.value) {
            inputUpdateScore(event.target.id, event.target.name, event.target.value);
        }
    }
});

var inputUpdateScore = function (id, name, value) {
    var question = questions.findOne({
        _id: id
    });
    if (question) {
        var prediction = predictions.findOne({
            _id: id
        });

        var obj = {};
        obj[name] = value;
        obj['date'] = new Date();
        if (prediction) {
            predictions.update({
                _id: id
            }, {
                $set: obj

            });
        } else {
            obj['_id'] = id;
            predictions.insert(
                obj
            );
        }
    }
}
