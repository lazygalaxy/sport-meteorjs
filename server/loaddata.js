Meteor.startup(function () {
    var participantContents = Assets.getText('countries.csv').split(/\r\n|\n/);
    console.log('updating countries: ' + participantContents.length);
    participantContents.forEach(function (entry) {
        var fields = entry.split(',');
        participants.upsert({
            _id: 'CTRY_' + fields[2],
        }, {
            type: 'COUNTRY',
            label: fields[0],
            iso2: fields[1],
            iso3: fields[2],
            iso_code: fields[3],
            image: 'flags/' + fields[2] + '.png'
        });
    });

    var euro2016Contents = Assets.getText('EURO2016.csv').split(/\r\n|\n/);
    console.log('updating euro2016 questions: ' + euro2016Contents.length);
    euro2016Contents.forEach(function (entry) {
        var fields = entry.split(';');

        var home_team_participant_id = 'CTRY_' + fields[2];
        var home_team_obj = participants.findOne({
            _id: home_team_participant_id
        });

        var away_team_participant_id = 'CTRY_' + fields[3];
        var away_team_obj = participants.findOne({
            _id: away_team_participant_id
        });

        if (home_team_obj && away_team_obj) {
            questions.upsert({
                _id: fields[0]
            }, {
                competition: 'EURO2016',
                date: fields[1],
                home_team: home_team_obj,
                away_team: away_team_obj,
                round: fields[4],
                description: fields[5],
            });
        } else {
            if (!home_team_obj) {
                console.error('could not find participant: ' + home_team_participant_id);
            }
            if (!away_team_obj) {
                console.error('could not find participant: ' + away_team_participant_id);
            }
        }
    });
});
