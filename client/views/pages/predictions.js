Template.predictions.helpers({
    getQuestions: function () {
        return questions.find({});
    },
    getPredictions: function () {
        return predictions.find({});
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
        console.info(id + ' ' + name + ' ' + value);
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

        console.log("saved!");
    }
}
