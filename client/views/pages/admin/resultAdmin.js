Template.resultAdmin.helpers({
    getAnswers: function () {
        var theQuestions = questions.find({}).fetch();
        if (Meteor.user()) {
            var answersMap = predictions.find({
                user_id: Meteor.user()._id
            }).fetch().reduce(function (map, obj) {
                map[obj.question_id] = obj;
                return map;
            }, {});

            theQuestions.forEach(function (question) {
                if (question._id in answersMap) {
                    question.home_score = answersMap[question._id].home_score;
                    question.away_score = answersMap[question._id].away_score;
                }
            });
        }
        return theQuestions;
    }
});

Template.resultAdmin.events({
    "focusout": function (event) {
        if (event.target.value) {
            inputUpsertAnswer(event.target.id, event.target.name, event.target.value);
        }
    },
    "keyup": function (event) {
        if (event.which == 13 && event.target.value) {
            inputUpsertAnswer(event.target.id, event.target.name, event.target.value);
        }
    }
});

var inputUpsertAnswer = function (id, name, value) {
    Meteor.call('upsertAnswer', id, name, value, function () {
        console.info('update the admin GUI here!!!');
    });
}
