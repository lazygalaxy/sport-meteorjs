getActor = function (id) {
    return Actors.findOne({
        _id: id
    });
}

Template.registerHelper('getActors', function (value, tokenizer, prefix) {
    var values = value.split(tokenizer);
    for (var i = 0; i < values.length; i++) {
        values[i] = prefix + '_' + values[i];
    }
    var actors = Actors.find({
        _id: {
            $in: values
        }
    });
    return actors;
});

Template.registerHelper('getActor', function (id) {
    var actor = getActor(id);
    if (actor) {
        return actor;
    } else {
        return getActor('CTRY_XYZ');
    }
});
