var AVATARS = ['female_1.jpg', 'female_2.jpg', 'female_3.jpg', 'female_4.jpg', 'female_5.jpg', 'female_6.jpg', 'female_7.jpg', 'female_8.jpg', 'male_1.jpg', 'male_2.jpg', 'male_3.jpg', 'male_4.jpg', 'male_5.jpg', 'male_6.jpg', 'male_7.jpg', 'male_8.jpg'];

Template.changeAvatar.helpers({
	getPossibleAvatars: function () {
		var avatars = [];

		avatars.push(Gravatar.imageUrl(getCurrentUser().emails[0].address, {
			size: 200,
			default: 'mm'
		}));

		AVATARS.forEach(function (avatar) {
			avatars.push(Meteor.absoluteUrl('avatars/' + avatar));
		});

		return avatars;
	}
});

Template.changeAvatar.events({
	'submit form': function (event) {
		event.preventDefault();
		var username = $('[id=username]').val();

		Meteor.call('changeUsername', username, function (error, result) {
			if (error) {
				toastr.error(error.reason)
			} else {
				toastr.success('Username has successfully been changed.');
				$('#changeUsername').modal('hide');
			}
		});
	}
});
