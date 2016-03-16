Meteor.startup(function () {
    const EURO2016 = 'EURO2016';
    const EURO2016TEST = 'EURO2016TEST';

    var vangosUser = Accounts.findUserByEmail('vangos@test.com');
    if (vangosUser) {
        UserInfo.upsert({
            _id: vangosUser._id
        }, {
            $set: {
                groupAdmin: ['AXPO', 'VONTOBEL'],
                competitionAdmin: [EURO2016]
            }
        });
    }

    var andreasUser = Accounts.findUserByEmail('andreas@test.com');
    if (andreasUser) {
        UserInfo.upsert({
            _id: andreasUser._id
        }, {
            $set: {
                groupAdmin: ['AXPO'],
                competitionAdmin: [EURO2016, EURO2016TEST]
            }
        });
    }

    Groups.upsert({
        _id: 'GLOBAL',
    }, {
        label: 'Global',
        image: 'logos/GOME.png',
        domains: [],
        admins: [],
        users: []
    });

    if (andreasUser && vangosUser) {
        Groups.upsert({
            _id: 'AXPO',
        }, {
            label: 'Axpo Group AG',
            image: 'logos/AXPO.png',
            domains: ['test.com'],
            admins: [andreasUser._id, vangosUser._id],
            users: [andreasUser._id]
        });

        Groups.upsert({
            _id: 'VONTOBEL',
        }, {
            label: 'Bank Vontobel',
            image: 'logos/VONTOBEL.png',
            domains: ['test2.com'],
            admins: [vangosUser._id],
            users: []
        });


        Competitions.upsert({
            _id: EURO2016,
        }, {
            image: 'logos/EURO2016.png',
            admins: [andreasUser._id, vangosUser._id]
        });

        Competitions.upsert({
            _id: EURO2016TEST,
        }, {
            image: 'logos/EURO2016TEST.png',
            admins: [andreasUser._id, vangosUser._id]
        });
    }




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

    loadMatches(EURO2016);
    loadMatches(EURO2016TEST);
});

var loadMatches = function (competitionLabel) {
    var euro2016MatchContents = Assets.getText(competitionLabel + '_matches.csv').split(/\r\n|\n/);
    console.log('updating ' + competitionLabel + ' matches: ' + euro2016MatchContents.length);
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
                _id: competitionLabel + fields[0]
            }, {
                competition: competitionLabel,
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

    var euro2016QuestionContents = Assets.getText(competitionLabel + '_questions.csv').split(/\r\n|\n/);
    console.log('updating ' + competitionLabel + ' questions: ' + euro2016QuestionContents.length);
    euro2016QuestionContents.forEach(function (entry) {
        var fields = entry.split(';');
        Questions.upsert({
            _id: competitionLabel + fields[0]
        }, {
            competition: competitionLabel,
            date: moment(fields[1] + ' +0000', "YYYYMMDD HH:mm Z").toDate(),
            description: fields[2],
            points: fields[3],
            options: fields[4]
        });
    });
}
