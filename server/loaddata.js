Meteor.startup(function () {
    if (!questions.findOne({
            competition: 'EURO2016'
        })) {
        var euro2016Contents = fileContents = Assets.getText('EURO2016.csv').split(/\r\n|\n/);
        console.log('adding euro2016 questions: ' + euro2016Contents.length);
        euro2016Contents.forEach(function (entry) {
            var fields = entry.split(';');
            questions.insert({
                competition: 'EURO2016',
                date: fields[0],
                home_team: fields[1],
                away_team: fields[2],
                round: fields[3],
                description: fields[4],
            });
        });
    }
});
