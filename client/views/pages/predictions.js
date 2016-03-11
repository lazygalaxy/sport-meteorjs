Template.predictions.helpers({
    getPredictions: function () {
        return questions.find({});
    }
});

Template.predictions.events({
    "focusout": function (event) {
        if (event.target.value) {
            console.info(event.target.id + ' ' + event.target.value + ' ' + event.joke);
            console.info(event);
        }
    }
});
