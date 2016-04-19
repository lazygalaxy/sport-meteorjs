Router.configure({
	layoutTemplate: 'mainLayout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

Router.onBeforeAction(function () {
	//TODO: find a way to manage sticky verify email token
	if (Accounts._verifyEmailToken && Session.get('verifyEmailToken') != Accounts._verifyEmailToken) {
		Session.set('verifyEmailToken', Accounts._verifyEmailToken);
		verifyEmail(Accounts._verifyEmailToken);
		this.next();
	}
	//TODO: find a way to manage sticky reset password token
	else if (Accounts._resetPasswordToken && Session.get('resetPasswordToken') != Accounts._resetPasswordToken) {
		console.info('new token!');
		Session.set('resetPasswordToken', Accounts._resetPasswordToken);
		this.render('resetPasswor');
	} else {
		this.next();
	}
});

var counter = 0;
var getRoute = function (route, loginRequired = true) {
	console.info('load: ' + counter++);

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
		return [Meteor.subscribe("customusers")];
	},
	action: function () {
		this.render(getRoute('login', false));
	}
});

Router.route('/register', {
	waitOn: function () {
		return [Meteor.subscribe("customusers")];
	},
	action: function () {
		this.render(getRoute('register', false));
	}
});

Router.route('/forgotPassword', {
	waitOn: function () {
		return [Meteor.subscribe("customusers")];
	},
	action: function () {
		this.render(getRoute('forgotPassword', false));
	}
});

Router.route('/passwordReset', {
	waitOn: function () {
		return [Meteor.subscribe("customusers")];
	},
	action: function () {
		this.render(getRoute('passwordReset'));
	}
});

var predictions = {
	waitOn: function () {
		return [Meteor.subscribe("actors"), Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions")];
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
		return [Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
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
		return [Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("groups"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
	},
	action: function () {
		if (getCurrentUser()) {
			setSelectedGroup(false);
			setSelectedCompetition(false);
		}
		this.render(getRoute('rankings'));
	}
});

Router.route('/resultAdmin', {
	waitOn: function () {
		return [Meteor.subscribe("actors"), Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("matches"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
	},
	action: function () {
		this.render(getRoute('resultAdmin'));
	}
});

Router.route('/userAdmin', {
	waitOn: function () {
		return [Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("groups")];
	},
	action: function () {
		if (getCurrentUser()) {
			setSelectedGroup(true);
			setSelectedCompetition(false);
		}
		this.render(getRoute('userAdmin'));
	}
});
