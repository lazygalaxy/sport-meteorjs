Template.points.helpers({
	getUserPoints: function () {
		var competition = Session.get('selectedCompetition');
		var user = Session.get('selectedUser');

		var points = Points.find({
			competitionId: competition._id,
			userId: user._id
		}, {
			sort: {
				endDate: 1,
				predictionId: 1
			}
		}).fetch();

		points.forEach(function (point) {
			point.result = 'Pending';
			point.prediction = 'N/A';

			var result = Results.findOne({
				_id: point.resultId
			});

			var prediction = undefined;
			if (point.endDate < new Date()) {
				prediction = Predictions.findOne({
					_id: point.predictionId
				});
			}

			if (point.questionId) {
				point.question = Questions.findOne({
					_id: point.questionId
				});
				point.matchOrQuestion = point.question.description;

				if (result) {
					point.result = result.answer;
				}

				if (prediction) {
					point.prediction = prediction.answer;
				}
			}

			if (point.matchId) {
				point.match = Matches.findOne({
					_id: point.matchId
				});
				point.matchOrQuestion = point.match.homeTeam.label + ' vs ' + point.match.awayTeam.label;

				if (result) {
					point.result = result.homeScore + ' - ' + result.awayScore;
				}

				if (prediction) {
					point.prediction = prediction.homeScore + ' - ' + prediction.awayScore;
				}
			}
		});

		return points;
	}
});
