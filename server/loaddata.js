Meteor.startup(function () {
    if (!participants.findOne({
            type: 'COUNTRY'
        })) {
        var participantContents = Assets.getText('countries.csv').split(/\r\n|\n/);
        console.log('adding countries: ' + participantContents.length);
        participantContents.forEach(function (entry) {
            var fields = entry.split(',');
            participants.insert({
                type: 'COUNTRY',
                label: fields[0],
                iso2: fields[1],
                iso3: fields[2],
                iso_code: fields[3],
                image: 'flags/' + fields[2] + '.png'
            });
        });
    };


    if (!questions.findOne({
            competition: 'EURO2016'
        })) {
        var euro2016Contents = Assets.getText('EURO2016.csv').split(/\r\n|\n/);
        console.log('adding euro2016 questions: ' + euro2016Contents.length);
        euro2016Contents.forEach(function (entry) {
            var fields = entry.split(';');

            var home_team_obj = participants.findOne({
                type: 'COUNTRY',
                iso3: fields[1]
            });

            var away_team_obj = participants.findOne({
                type: 'COUNTRY',
                iso3: fields[2]
            });

            if (home_team_obj && away_team_obj) {
                questions.insert({
                    competition: 'EURO2016',
                    date: fields[0],
                    home_team: home_team_obj,
                    away_team: away_team_obj,
                    round: fields[3],
                    description: fields[4],
                });
            } else {
                if (!home_team_obj) {
                    console.error('could not find team: ' + fields[1]);
                }
                if (!away_team_obj) {
                    console.error('could not find team: ' + fields[2]);
                }
            }
        });
    }
});
