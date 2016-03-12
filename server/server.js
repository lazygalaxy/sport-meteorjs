//methods
Meteor.methods({
    'upsertPrediction': function (id, name, value) {
        var obj = {};
        obj[name] = value;
        obj['date'] = new Date();
        predictions.upsert({
            _id: id
        }, {
            $set: obj
        });
    }
});
