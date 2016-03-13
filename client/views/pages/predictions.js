Template.predictions.helpers({
    getQuestions: function () {
        var theQuestions = questions.find({}).fetch();
        if (Meteor.user()) {
            var predictionsMap = predictions.find({
                user_id: Meteor.user()._id
            }).fetch().reduce(function (map, obj) {
                map[obj.question_id] = obj;
                return map;
            }, {});

            theQuestions.forEach(function (question) {
                if (question._id in predictionsMap) {
                    question.home_score = predictionsMap[question._id].home_score;
                    question.away_score = predictionsMap[question._id].away_score;
                }
            });
        }
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
    Meteor.call('upsertPrediction', id, name, value, function () {
        console.info('update the GUI here!!!');
    });
}
