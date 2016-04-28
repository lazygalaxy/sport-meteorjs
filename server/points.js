 calculatePoints = function (competitionId) {
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
 			var info = {};
 			info._id = match._id + '_' + userId;
 			info.matchId = match._id;
 			info.userId = userId;
 			info.competitionId = competitionId;
 			info.endDate = match.date;
 			info.points = 0;

 			if (match.date < new Date()) {
 				var prediction = predictionMap[userId][match._id];
 				if (prediction) {
 					info.predictionId = prediction._id;
 					info.predictionDate = prediction.date;
 				}

 				var result = resultMap[match._id];
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
 			}

 			infos.push(info);
 		});

 		questions.forEach(function (question) {
 			var info = {};
 			info._id = question._id + '_' + userId;
 			info.questionId = question._id;
 			info.userId = userId;
 			info.competitionId = competitionId;
 			info.endDate = question.date;
 			info.points = 0;

 			if (question.date < new Date()) {
 				var prediction = predictionMap[userId][question._id];
 				if (prediction) {
 					info.predictionId = prediction._id;
 					info.predictionDate = prediction.date;
 				}

 				var result = resultMap[question._id];
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
 			}

 			infos.push(info);
 		});
 	});

 	return infos;
 }

 upsertCalculatePoints = function (competitionId) {
 	console.info('calculating points for ' + competitionId);
 	var points = calculatePoints(competitionId);
 	points.forEach(function (point) {
 		Points.upsert({
 			_id: point._id
 		}, point);
 	});
 }

 upsertCalculatePoints('EURO2016')
 upsertCalculatePoints('EURO2016TEST')
