Router.configure({
	layoutTemplate: 'mainLayout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

//var counter = 0;
var getRoute = function (route, loginRequired = true) {
	//console.info('load: ' + counter++);

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
		return [Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
	},
	action: function () {
		if (getCurrentUser()) {
			setSelectedUser();
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

Router.route('/resultAdmin', {
	waitOn: function () {
		return [Meteor.subscribe("actors"), Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("matches"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
	},
	action: function () {
		this.render(getRoute('resultAdmin'));
	}
});

Router.route('/userAdmin', {
	waitOn: function () {
		return [Meteor.subscribe("competitions"), Meteor.subscribe("userinfo"), Meteor.subscribe("groups")];
	},
	action: function () {
		if (getCurrentUser()) {
			setSelectedGroup(true);
			setSelectedCompetition(false);
		}
		this.render(getRoute('userAdmin'));
	}
});
