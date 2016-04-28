calculateRankings = function (groupId, competitionId, isPaid = false) {
	var allUserPoints = Points.find({
		competitionId: competitionId
	}).fetch();

	//return allUserPoints;
	var data = {};
	allUserPoints.forEach(function (userPointInfo) {
		var user = UserInfo.findOne({
			_id: userPointInfo.userId
		});

		if (user.groups.indexOf(groupId) > -1) {
			if (!isPaid || (user.emails[0].verified && user[getPaidAttribute()])) {
				if (!data[userPointInfo.userId]) {
					data[userPointInfo.userId] = {}
					data[userPointInfo.userId].username = user.username;
					data[userPointInfo.userId].avatar = user.profile.avatar;
					data[userPointInfo.userId].points = 0;

					if (isPaid) {
						var paidDate = getPaidDate(user._id);
						if (paidDate) {
							data[userPointInfo.userId].paidDate = paidDate;
						} else {
							data[userPointInfo.userId].paidDate = 'N/A';
						}
					}
				}
				data[userPointInfo.userId].points += parseInt(userPointInfo.points);
				if (userPointInfo.predictionDate) {
					if (!data[userPointInfo.userId].lastPredictionDate || data[userPointInfo.userId].lastPredictionDate < userPointInfo.predictionDate) {
						data[userPointInfo.userId].lastPredictionDate = userPointInfo.predictionDate;
					}
				}
			}
		}
	});
	//return data;

	var dataArray = [];
	Object.keys(data).forEach(function (userId) {
		var userPoints = data[userId];
		dataArray.push(userPoints);
	});

	dataArray.sort(function (a, b) {
		if (a.points < b.points)
			return 1;
		else if (a.points > b.points)
			return -1;
		else if (a.lastPredictionDate < b.lastPredictionDate)
			return -1;
		else if (a.lastPredictionDate > b.lastPredictionDate)
			return 1;
		else
			return 0;
	});

	var rank = 0;
	var lastPoints = -1;
	dataArray.forEach(function (entry) {
		if (entry.points != lastPoints) {
			rank += 1;
			entry.rank = rank;
			lastPoints = entry.points;
		} else {
			entry.rank = '-';
		}
	});

	return dataArray;
}
