var ALLOW_ROUTES = ['login', 'register', 'forgotPassword'];

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});

Router.onBeforeAction(function () {
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

//TODO: remove this once loading looks good
Router.route('/loading', function () {
    this.render('loading');
});

Router.route('/', function () {
    Router.go('predictions');
});

Router.route('/home', function () {
    Router.go('predictions');
});

Router.route('/predictions', function () {
    this.render('predictions');
});

Router.route('/points/:_id', {
    waitOn: function () {
        return Meteor.subscribe("customusers");
    },
    action: function () {
        setSelectedUser(this.params._id);
        this.render('points');
    }
});

Router.route('/standings', {
    waitOn: function () {
        return Meteor.subscribe("customusers");
    },
    action: function () {
        this.render('standings');
    }
});

Router.route('/resultAdmin', {
    waitOn: function () {
        return Meteor.subscribe("customusers");
    },
    action: function () {
        this.render('resultAdmin');
    }
});

Router.route('/userAdmin', {
    waitOn: function () {
        return Meteor.subscribe("customusers");
    },
    action: function () {
        this.render('userAdmin');
    }
});
