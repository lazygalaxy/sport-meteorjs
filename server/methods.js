Meteor.startup(function () {
	Meteor.methods({
		'upsertPrediction': function (itemId, name, value) {
			if (Meteor.user()) {
				var obj = {};
				var validation = validateValue(itemId, name, value);
				if (validation.length == 2) {
					obj[name + 'Error'] = true;
					obj['itemId'] = itemId;
					obj['competitionId'] = itemId.split('_')[0];
					obj['userId'] = Meteor.user()._id;
					Predictions.upsert({
						_id: itemId + '_' + Meteor.user()._id
					}, {
						$set: obj
					});
					throw new Meteor.Error(500, validation[1]);
				}

				value = validation[0];
				var nowDate = new Date();
				if (nowDate > validation[2]) {
					throw new Meteor.Error(500, 'Prediction item has expired.');
				}

				var prediction = Predictions.findOne({
					_id: itemId + '_' + Meteor.user()._id
				});
				if (!prediction || !prediction.hasOwnProperty(name) || prediction[name] != value) {
					obj[name] = value;
					obj[name + 'Error'] = false;
					obj['date'] = new Date();
					obj['itemId'] = itemId;
					obj['competitionId'] = itemId.split('_')[0];
					obj['userId'] = Meteor.user()._id;
					Predictions.upsert({
						_id: itemId + '_' + Meteor.user()._id
					}, {
						$set: obj
					});
					return validation[1];
				} else if (prediction[name] == value && prediction[name + 'Error']) {
					obj[name + 'Error'] = false;
					Predictions.upsert({
						_id: itemId + '_' + Meteor.user()._id
					}, {
						$set: obj
					});
				}
			}
		},
		'upsertResult': function (itemId, name, value) {
			if (Meteor.user()) {
				var validation = validateValue(itemId, name, value);
				if (validation.length == 2) {
					throw new Meteor.Error(500, validation[1]);
				}

				value = validation[0];
				var result = Results.findOne({
					_id: itemId + '_' + Meteor.user()._id
				});
				if (!result || !result.hasOwnProperty(name) || result[name] != value) {
					var obj = {};
					obj[name] = value;
					obj['date'] = new Date();
					obj['itemId'] = itemId;
					obj['competitionId'] = itemId.split('_')[0];
					obj['userId'] = Meteor.user()._id;
					Results.upsert({
						_id: itemId + '_' + Meteor.user()._id
					}, {
						$set: obj
					});
					return validation[1];
				}
			}
		},
		'upsertUser': function (userId, name, value) {
			if (Meteor.user()) {
				var user = Meteor.users.findOne({
					_id: userId
				});

				var userInfo = UserInfo.findOne({
					_id: userId
				});
				if (!userInfo || !userInfo.hasOwnProperty(name) || userInfo[name] != value) {
					var obj = {};
					obj[name] = value;
					UserInfo.upsert({
						_id: userId
					}, {
						$set: obj
					});

					return 'Updated ' + user.username + ' to ' + value + '.';
				}
			}
		},
		'changeUsername': function (username) {
			Accounts.setUsername(Meteor.user()._id, username);
		},
		'sendVerificationEmails': function (emails) {
			emails.forEach(function (email) {
				Accounts.sendVerificationEmail(Meteor.user()._id, email);
			});
		},
		'updateAvatar': function (id, url) {
			return updateAvatar(id, url);
		}
	});

	updateAvatar = function (id, url) {
		try {
			var user = Meteor.users.findOne({
				_id: id
			});
			if (!user) {
				throw new Meteor.Error(500, 'Unknown user ' + id + '.');
			}

			Meteor.users.update({
				_id: id
			}, {
				$set: {
					'profile.avatar': url,
					'profile.date': new Date()
				}
			});
			return 'User ' + user.username + ' avatar has been updated';
		} catch (e) {
			throw new Meteor.Error(500, e.message);
		}
	}

	var validateValue = function (itemId, name, value) {
		value = value.trim();

		var message = '';
		var predictionEndDate;

		var match = Matches.findOne({
			_id: itemId
		});
		if (match) {
			if (!value || (value % 1 != 0) || value < 0 || value > 99) {
				message = 'Invalid value entered ' + value + '. Integer values between 0 and 99 expected.';
				return [value, message];
			}
			value = parseInt(value);
			predictionEndDate = match.date;
			if (name == 'homeScore') {
				message = match.homeTeam.label + ' score set to ' + value + '.';
			} else if (name == 'awayScore') {
				message = match.awayTeam.label + ' score set to ' + value + '.';
			}
		} else {
			var question = Questions.findOne({
				_id: itemId
			});
			if (question) {
				predictionEndDate = question.date;

				if (question.optionType == 'INTEGER') {
					if (!value || (value % 1 != 0) || value < 0 || value > 999) {
						message = 'Invalid value entered ' + value + '. Integer values between 0 and 999 expected.';
						return [value, message];
					}
					value = parseInt(value);
					message = question.description + ' Answer set to ' + value + '.';
				} else {
					var actor = Actors.findOne({
						_id: value
					});
					message = question.description + ' Answer set to ' + actor.label + '.';
				}
			} else {
				throw new Meteor.Error(500, 'Prediction item not found ' + itemId + '.');
			}
		}

		return [value, message, predictionEndDate];
	}
});
