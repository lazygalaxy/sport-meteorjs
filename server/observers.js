Meteor.startup(function () {
	var AVATARS = ['female_1.jpg', 'female_2.jpg', 'female_3.jpg', 'female_4.jpg', 'female_5.jpg', 'female_6.jpg', 'female_7.jpg', 'female_8.jpg', 'male_1.jpg', 'male_2.jpg', 'male_3.jpg', 'male_4.jpg', 'male_5.jpg', 'male_6.jpg', 'male_7.jpg', 'male_8.jpg'];
	Meteor.users.find({}).observeChanges({
		added: function (id, doc) {
			// update meteor user doc into consolidated userinfo table
			UserInfo.upsert({
				_id: id,
			}, {
				$set: doc
			});

			//TODO: find a better way to add users to groups
			var groups = Groups.find({});
			groups.forEach(function (group) {
				var found = (group._id == 'GLOBAL');
				group.domains.forEach(function (domain) {
					doc.emails.forEach(function (email) {
						if (email.address.endsWith(domain)) {
							found = true;
						}
					});
				});
				if (found) {
					UserInfo.upsert({
						_id: id,
					}, {
						$addToSet: {
							groups: group._id
						}
					});
				}
			});

			if (!doc.profile) {
				var index = Math.floor(Math.random() * AVATARS.length);
				var url = Meteor.absoluteUrl('avatars/' + AVATARS[index])
				updateAvatar(id, url);
			}
		},
		changed: function (id, doc) {
			// update meteor user doc into consolidated userinfo table
			UserInfo.upsert({
				_id: id,
			}, {
				$set: doc
			});
		}
	});

	//TODO resolve issue where this is called multiple time on startup
	Results.find({}).observeChanges({
		added: function (id, doc) {
			upsertCalculatePoints(doc.competitionId);
		},
		changed: function (id, doc) {
			var result = Results.findOne({
				_id: id
			});
			upsertCalculatePoints(result.competitionId);
		}
	});

	Predictions.find({}).observeChanges({
		added: function (id, doc) {
			if (!Points.findOne({
					_id: id
				})) {
				upsertCalculatePoints(doc.competitionId);
			}
		}
	});
});
