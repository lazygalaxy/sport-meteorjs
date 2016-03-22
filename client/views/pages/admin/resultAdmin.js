Template.resultAdmin.helpers({
    getAnswerItems: function () {
        var currentUser = getCurrentUser();

        var matches = Matches.find({
            date: {
                $lt: new Date()
            },
            competition: {
                $in: currentUser.competitionAdmin
            }
        }).fetch();

        var questions = Questions.find({
            date: {
                $lt: new Date()
            },
            competition: {
                $in: currentUser.competitionAdmin
            }
        }).fetch();

        if (Meteor.user()) {
            var resultsMap = Results.find({
                userId: Meteor.user()._id
            }).fetch().reduce(function (map, obj) {
                map[obj.itemId] = obj;
                return map;
            }, {});

            matches.forEach(function (match) {
                match.type = 'match';
                if (match._id in resultsMap) {
                    match.homeScore = resultsMap[match._id].homeScore;
                    match.awayScore = resultsMap[match._id].awayScore;
                }
            });

            questions.forEach(function (question) {
                question.type = 'question';
                if (question._id in resultsMap) {
                    question.answer = resultsMap[question._id].answer;
                }
            });
        }

        var answerItems = questions.concat(matches);
        answerItems.sort(function (a, b) {
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

        return answerItems;
    }
});

Template.resultAdmin.events({
    "focusout": function (event) {
        if (event.target.value) {
            inputUpsertResult(event.target.id, event.target.name, event.target.value);
        }
    },
    "keyup": function (event) {
        if (event.which == 13 && event.target.value) {
            inputUpsertResult(event.target.id, event.target.name, event.target.value);
        }
    },
    "click .answer-selection li a": function (event) {
        var itemId = event.target.parentNode.id;
        var answer = event.target.id;
        console.log(itemId + ' - ' + answer);
        inputUpsertResult(itemId, 'answer', answer);
    }
});
