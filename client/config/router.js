// routes allowed when a user is not logged in
var ALLOW_ROUTES = ['login', 'register', 'forgotPassword'];

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});

Router.onBeforeAction(function () {
    if (Accounts._verifyEmailToken) {
        verifyEmail(Accounts._verifyEmailToken);
    }

    if (Accounts._resetPasswordToken) {
        //handle reset password stuff
        Session.set('resetPasswordToken', Accounts._resetPasswordToken);
        this.render('resetPassword');
    } else {
        //if there is no reset password stuff, bussiness as usual
        var routeName = Router.current().route.getName();
        if (!Meteor.userId()) {
            //if the user is not logged in, he should not be able to roam freely
            if (ALLOW_ROUTES.indexOf(routeName) > -1) {
                //if it is one of the known routes, render it
                this.render(routeName);
            } else {
                //any other random route for non members will be directed to the login page
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

Router.route('/rankings', {
    waitOn: function () {
        return [Meteor.subscribe("competitions"), Meteor.subscribe("customusers"), Meteor.subscribe("groups"), Meteor.subscribe("matches"), Meteor.subscribe("predictions"), Meteor.subscribe("questions"), Meteor.subscribe("results")];
    },
    action: function () {
        setSelectedGroup(false);
        setSelectedCompetition(false);
        this.render('rankings');
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
