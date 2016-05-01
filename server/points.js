getPointInfoByPrediction = function (predictionId) {
	var infos = [];

	var prediction = Predictions.findOne({
		_id: predictionId
	});

	var match = Matches.findOne({
		_id: prediction.itemId
	});

	var question = Questions.findOne({
		_id: prediction.itemId
	});

	if (match) {
		var info = getMatchInfo(match, prediction);
		infos.push(info);
	}

	if (question) {
		var info = getQuestionInfo(question, prediction);
		infos.push(info);
	}

	return infos;
}

getPointInfoByResult = function (resultId) {
	var infos = [];

	var result = Results.findOne({
		_id: resultId
	});

	var match = Matches.findOne({
		_id: result.itemId
	});

	var question = Questions.findOne({
		_id: result.itemId
	});

	var predictions = Predictions.find({
		itemId: result.itemId
	});

	predictions.forEach(function (prediction) {
		if (match) {
			var info = getMatchInfo(match, prediction, result);
			infos.push(info);
		}

		if (question) {
			var info = getQuestionInfo(question, prediction, result);
			infos.push(info);
		}

	});

	return infos;
}

getPointInfoByCompetition = function (competitionId) {
	var matches = Matches.find({
		competitionId: competitionId,
	});

	var questions = Questions.find({
		competitionId: competitionId,
	});

	var predictionMap = Predictions.find({
		competitionId: competitionId
	}).fetch().reduce(function (map, obj) {
		if (!map[obj.userId]) {
			map[obj.userId] = {}
		}
		map[obj.userId][obj.itemId] = obj;
		return map;
	}, {});

	var resultMap = Results.find({
		competitionId: competitionId
	}, {
		sort: {
			date: 1
		}
	}).fetch().reduce(function (map, obj) {
		//TODO: consider the highest weighted here if multiple exists
		map[obj.itemId] = obj;
		return map;
	}, {});

	var infos = [];

	Object.keys(predictionMap).forEach(function (userId) {
		matches.forEach(function (match) {
			var prediction = predictionMap[userId][match._id];
			if (prediction) {
				var result = resultMap[match._id];
				var info = getMatchInfo(match, prediction, result);
				infos.push(info);
			}
		});

		questions.forEach(function (question) {
			var prediction = predictionMap[userId][question._id];
			if (prediction) {
				var result = resultMap[question._id];
				var info = getQuestionInfo(question, prediction, result);
				infos.push(info);
			}
		});
	});

	return infos;
}

var getMatchInfo = function (match, prediction, result = undefined) {
	var info = {};
	info._id = match._id + '_' + prediction.userId;
	info.matchId = match._id;
	info.userId = prediction.userId;
	info.competitionId = match.competitionId;
	info.endDate = match.date;
	info.points = 0;

	if (match.date < new Date()) {
		if (result) {
			info.resultId = result._id;
		}

		if (prediction && result) {
			//calculate the actual points
			if (result.homeScore == prediction.homeScore && result.awayScore == prediction.awayScore) {
				info.points = 3;
			} else if ((result.homeScore - result.awayScore) == (prediction.homeScore - prediction.awayScore)) {
				info.points = 2;
			} else if ((result.homeScore > result.awayScore && prediction.awayScore > prediction.awayScore) || (result.homeScore < result.awayScore && prediction.awayScore < prediction.awayScore)) {
				info.points = 1;
			}
		}
		info.predictionId = prediction._id;
	}

	info.predictionDate = prediction.date;

	return info;
}

var getQuestionInfo = function (question, prediction, result = undefined) {
	var info = {};
	info._id = question._id + '_' + prediction.userId;
	info.questionId = question._id;
	info.userId = prediction.userId;
	info.competitionId = question.competitionId;
	info.endDate = question.date;
	info.points = 0;

	if (question.date < new Date()) {
		if (result) {
			info.resultId = result._id;
		}

		if (prediction && result) {
			if (question.optionType == 'INTEGER') {
				if (Math.abs(result.answer - prediction.answer) <= question.threshold) {
					info.points = question.points;
				} else {
					info.points = 0;
				}
			} else if (result.answer == prediction.answer) {
				info.points = question.points;
			}
		}
		info.predictionId = prediction._id;
	}

	info.predictionDate = prediction.date;

	return info;
}

upsertPointInfoByPrediction = function (predictionId) {
	//console.info('prediction change ' + predictionId);
	var points = getPointInfoByPrediction(predictionId);
	points.forEach(function (point) {
		Points.upsert({
			_id: point._id
		}, point);
	});
}

upsertPointInfoByResult = function (resultId) {
	//console.info('result change ' + resultId);
	var points = getPointInfoByResult(resultId);
	points.forEach(function (point) {
		Points.upsert({
			_id: point._id
		}, point);
	});
}

upsertPointInfoByCompetition = function (competitionId) {
	//console.info('competition change ' + competitionId);
	var points = getPointInfoByCompetition(competitionId);
	points.forEach(function (point) {
		Points.upsert({
			_id: point._id
		}, point);
	});
}
