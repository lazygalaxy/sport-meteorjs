Router.configure({
	layoutTemplate: 'mainLayout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

var getRoute = function (route, loginRequired = true) {
	if (!Meteor.userId()) {
		if (loginRequired) {
			return 'login';
		}
	} else {
		if (!loginRequired) {
			return 'predictions'
		}
	}

	return route;
}

Router.route('/login', {
	waitOn: function () {
		return [Meteor.subscribe("userinfo")];
	},
	action: function () {
		this.render(getRoute('login', false));
	}
});

Router.route('/register', {
	waitOn: function () {
		return [Meteor.subscribe("userinfo")];
	},
	action: function () {
		this.render(getRoute('register', false));
	}
});

Router.route('/forgotPassword', {
	waitOn: function () {
		return [Meteor.subscribe("userinfo")];
	},
	action: function () {
		this.render(getRoute('forgotPassword', false));
	}
});

Router.route('/resetPassword/:token', {
	waitOn: function () {
		return [Meteor.subscribe("userinfo")];
	},
	action: function () {
		Session.set('resetPasswordToken', this.params.token);
		this.render('resetPassword');
	}
});

Router.route('/verifyEmail/:token', {
	waitOn: function () {
		return [Meteor.subscribe("userinfo")];
	},
	action: function () {
		verifyEmail(this.params.token);
		Router.go('home');
	}
});

var predictions = {
	waitOn: function () {
		return [Meteor.subscribe("actors"), Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions")];
	},
	action: function () {
		this.render(getRoute('predictions'));
	}
}

Router.route('/', predictions);
Router.route('/home', predictions);
Router.route('/predictions', predictions);

Router.route('/points', {
	waitOn: function () {
		return [Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("groups"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
	},
	action: function () {
		if (getCurrentUser()) {
			setSelectedUser();
			setSelectedGroup(false);
			setSelectedCompetition(false);
		}
		this.render(getRoute('points'));
	}
});

Router.route('/rankings', {
	waitOn: function () {
		return [Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("groups"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
	},
	action: function () {
		if (getCurrentUser()) {
			setSelectedGroup(false);
			setSelectedCompetition(false);
			setSelectedPaid();
		}
		this.render(getRoute('rankings'));
	}
});

Router.route('/results', {
	waitOn: function () {
		return [Meteor.subscribe("actors"), Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("matches"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
	},
	action: function () {
		this.render(getRoute('results'));
	}
});

Router.route('/groups', {
	waitOn: function () {
		return [Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("groups")];
	},
	action: function () {
		if (getCurrentUser()) {
			setSelectedGroup(true);
			setSelectedCompetition(false);
		}
		this.render(getRoute('groups'));
	}
});

Router.route('/groups/:groupcode', {
	waitOn: function () {
		return [Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("groups")];
	},
	action: function () {
		var code = this.params.groupcode;
		var isAdmin = this.params.query.admin == 't';
		if (getCurrentUser()) {
			Meteor.call('joinGroup', code, isAdmin, function (error, result) {
				if (error) {
					toastr.error(error.reason);
				} else if (result) {
					//resubscription is required to acquire
					Meteor.subscribe("groups");
					var group = result;
					toastr.success('You have joined the group ' + group.label + '.', 'Join Group');
					Session.set('groupid', group._id);
					if (isAdmin) {
						Router.go('/' + getRoute('groups'));
					} else {
						Router.go('/' + getRoute('rankings'));
					}
				}
			});
		} else {
			toastr.success('Please login to join a group!');
			Router.go('/');
		}
	}
});
