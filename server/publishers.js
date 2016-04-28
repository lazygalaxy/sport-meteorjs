Meteor.startup(function () {
	Meteor.publish("actors", function () {
		return Actors.find({});
	});

	Meteor.publish("competitions", function () {
		return Competitions.find({});
	});

	Meteor.publish("groups", function () {
		var userInfo = UserInfo.findOne({
			_id: this.userId
		});

		if (userInfo) {
			var adminGroups = userInfo.adminGroups;
			if (!adminGroups) {
				adminGroups = [];
			}

			return Groups.find({
				$or: [{
					_id: {
						$in: userInfo.groups
					}
            }, {
					_id: {
						$in: adminGroups
					}
            }]
			});
		}
		return [];
	});

	Meteor.publish("matches", function () {
		return Matches.find({});
	});

	Meteor.publish("points", function () {
		return Points.find({});
	});

	Meteor.publish("predictions", function () {
		return Predictions.find({});
	});

	Meteor.publish("questions", function () {
		return Questions.find({});
	});

	Meteor.publish("results", function () {
		return Results.find({});
	});

	Meteor.publish("userinfo", function () {
		return UserInfo.find({});
	});
});
