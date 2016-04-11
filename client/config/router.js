// routes allowed when a user is not logged in
var ALLOW_ROUTES = ['login', 'register', 'forgotPassword'];

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});

Router.onBeforeAction(function () {
    if (Accounts._resetPasswordToken) {
        Session.set('resetPasswordToken', Accounts._resetPasswordToken);
        this.render('resetPassword');
    } else {
        var routeName = Router.current().route.getName();

        if (!Meteor.userId()) {
            if (ALLOW_ROUTES.indexOf(routeName) > -1) {
                this.render(routeName);
            } else {
                Router.go('login');
            }
        } else {
            if (ALLOW_ROUTES.indexOf(routeName) == -1) {
                this.next();
            } else {
                Router.go('home');
            }
        }
    }
});

Router.route('/login', function () {
    this.render('login');
});

Router.route('/register', function () {
    this.render('register');
});

Router.route('/forgotPassword', function () {
    this.render('forgotPassword');
});

Router.route('/resetPassword', function () {
    this.render('resetPassword');
});


//Router.route('/loading', function () {
//    this.render('loading');
//});

Router.route('/', function () {
    Router.go('predictions');
});

Router.route('/home', function () {
    Router.go('predictions');
});

Router.route('/predictions', {
    waitOn: function () {
        return [Meteor.subscribe("actors"), Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions")];
    },
    action: function () {
        this.render('predictions');
    }
});

Router.route('/points', {
    waitOn: function () {
        return [Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
    },
    action: function () {
        setSelectedUser();
        setSelectedCompetition(false);
        this.render('points');
    }
});

Router.route('/standings', {
    waitOn: function () {
        return [Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("groups"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
    },
    action: function () {
        setSelectedGroup(false);
        setSelectedCompetition(false);
        this.render('standings');
    }
});

Router.route('/resultAdmin', {
    waitOn: function () {
        return [Meteor.subscribe("actors"), Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("matches"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
    },
    action: function () {
        this.render('resultAdmin');
    }
});

Router.route('/userAdmin', {
    waitOn: function () {
        return [Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("groups")];
    },
    action: function () {
        setSelectedGroup(true);
        setSelectedCompetition(false);
        this.render('userAdmin');
    }
});
