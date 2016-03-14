Meteor.startup(function () {
    var countryContents = Assets.getText('countries.csv').split(/\r\n|\n/);
    console.log('updating countries: ' + countryContents.length);
    countryContents.forEach(function (entry) {
        var fields = entry.split(';');
        Actors.upsert({
            _id: 'CTRY_' + fields[2],
        }, {
            type: 'CTRY',
            label: fields[0],
            iso2: fields[1],
            iso3: fields[2],
            isoCode: fields[3],
            image: 'flags/' + fields[2] + '.png'
        });
    });

    var euro2016MatchContents = Assets.getText('EURO2016_matches.csv').split(/\r\n|\n/);
    console.log('updating euro2016 matches: ' + euro2016MatchContents.length);
    euro2016MatchContents.forEach(function (entry) {
        var fields = entry.split(';');

        var homeTeamId = 'CTRY_' + fields[2];
        var homeTeamObj = Actors.findOne({
            _id: homeTeamId
        });

        var awayTeamId = 'CTRY_' + fields[3];
        var awayTeamObj = Actors.findOne({
            _id: awayTeamId
        });

        if (homeTeamObj && awayTeamObj) {
            Matches.upsert({
                _id: fields[0]
            }, {
                competition: 'EURO2016',
                date: moment(fields[1] + ' +0000', "YYYYMMDD HH:mm Z").toDate(),
                homeTeam: homeTeamObj,
                awayTeam: awayTeamObj,
                round: fields[4],
                description: fields[5],
            });
        } else {
            if (!homeTeamObj) {
                console.error('could not find team: ' + homeTeamId);
            }
            if (!awayTeamObj) {
                console.error('could not find team: ' + awayTeamId);
            }
        }
    });

    var euro2016QuestionContents = Assets.getText('EURO2016_questions.csv').split(/\r\n|\n/);
    console.log('updating euro2016 questions: ' + euro2016QuestionContents.length);
    euro2016QuestionContents.forEach(function (entry) {
        var fields = entry.split(';');
        Questions.upsert({
            _id: fields[0]
        }, {
            competition: 'EURO2016',
            date: moment(fields[1] + ' +0000', "YYYYMMDD HH:mm Z").toDate(),
            description: fields[2],
            points: fields[3],
            options: fields[4]
        });
    });
});
