Meteor.startup(function () {
	const GLOBAL = 'GLOBAL';
	const AXPO = 'AXPO';
	const AXPO_TRADING = 'AXPO_TRADING';
	const VONTOBEL = 'VONTOBEL';

	const EURO2016 = 'EURO2016';
	const EURO2016TEST = 'EURO2016TEST';

	//TODO: these group upserts could form part of a .csv files
	Groups.upsert({
		_id: GLOBAL,
	}, {
		label: 'Global',
		domains: [],
		paid: false
	});

	Groups.upsert({
		_id: AXPO,
	}, {
		label: 'Axpo Group',
		domains: ['axpo.com', 'axpo.ch', 'avectris.com', 'ckw.ch'],
		paid: false
	});

	Groups.upsert({
		_id: AXPO_TRADING,
	}, {
		label: 'Axpo Trading',
		domains: ['axpo.com', 'axpo.ch'],
		paid: true
	});

	Groups.upsert({
		_id: VONTOBEL,
	}, {
		label: 'Bank Vontobel',
		domains: ['vontobel.com', 'vontobel.ch'],
		paid: false
	});

	Competitions.upsert({
		_id: EURO2016,
	}, {
		label: 'Euro2016'
	});

	Competitions.upsert({
		_id: EURO2016TEST,
	}, {
		label: 'Euro2016 (Test)'
	});

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
			isoCode: fields[3]
		});
	});

	Actors.upsert({
		_id: 'UNKNOWN',
	}, {
		type: 'COMMON',
		label: 'Unknown'
	});

	Actors.upsert({
		_id: 'BOOL_UNKNOWN',
	}, {
		type: 'BOOL',
		label: 'Unknown'
	});

	Actors.upsert({
		_id: 'BOOL_YES',
	}, {
		type: 'BOOL',
		label: 'Yes'
	});

	Actors.upsert({
		_id: 'BOOL_NO',
	}, {
		type: 'BOOL',
		label: 'No'
	});

	loadMatches(EURO2016);
	loadMatches(EURO2016TEST);

	var vangosUser = Accounts.findUserByEmail('vangos@lazygalaxy.com');
	if (vangosUser) {
		UserInfo.upsert({
			_id: vangosUser._id
		}, {
			$set: {
				adminGroups: [AXPO_TRADING, VONTOBEL],
				adminCompetitions: [EURO2016, EURO2016TEST]
			}
		});
	}

	var olafUser = Accounts.findUserByEmail('olaf.stehr@axpo.com');
	if (olafUser) {
		UserInfo.upsert({
			_id: olafUser._id
		}, {
			$set: {
				adminGroups: [AXPO_TRADING],
				adminCompetitions: [EURO2016TEST]
			}
		});
	}

	var andreasUser = Accounts.findUserByEmail('andreas.muenst@axpo.com');
	if (andreasUser) {
		UserInfo.update({
			_id: andreasUser._id
		}, {
			$set: {
				adminGroups: [AXPO_TRADING],
				adminCompetitions: [EURO2016TEST]
			}
		});
	}
});

var loadMatches = function (competitionLabel) {
	var euro2016MatchContents = Assets.getText(competitionLabel + '_matches.csv').split(/\r\n|\n/);
	var startMoment;
	var endMoment;

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
			var theMoment = moment(fields[1] + ' +0000', "YYYYMMDD HH:mm Z");
			if (!startMoment) {
				startMoment = theMoment;
				endMoment = theMoment;
			}

			if (theMoment.isBefore(startMoment)) {
				startMoment = theMoment;
			}
			if (theMoment.isAfter(endMoment)) {
				endMoment = theMoment;
			}

			Matches.upsert({
				_id: competitionLabel + fields[0]
			}, {
				competitionId: competitionLabel,
				date: theMoment.toDate(),
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
		var theDate = moment(fields[1] + ' +0000', "YYYYMMDD HH:mm Z").toDate();

		Questions.upsert({
			_id: competitionLabel + fields[0]
		}, {
			competitionId: competitionLabel,
			date: theDate,
			description: fields[2],
			points: fields[3],
			threshold: fields[4],
			optionType: fields[5],
			options: fields[6],
			details: fields[7]
		});
	});

	Competitions.upsert({
		_id: competitionLabel,
	}, {
		$set: {
			startDate: startMoment.toDate(),
			endDate: endMoment.toDate()
		}
	});
}
