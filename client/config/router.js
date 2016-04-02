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

Router.route('/standings', {
    waitOn: function () {
        return [Meteor.subscribe("customusers")];
    },
    action: function () {
        //TODO: not entirely sure this is the best way to handle this
        if (getCurrentUser()) {
            var groupLength = getCurrentUser().groups.length;
            Session.set('selectedGroup', getCurrentUser().groups[groupLength - 1]);
            console.info(getCurrentUser().groups[groupLength - 1]);
            //TODO: should not be hardcoded to EURO2016
            Session.set('selectedCompetition', 'EURO2016');
            this.render('standings');
        }
    }
});

Router.route('/resultAdmin', {
    waitOn: function () {
        return Meteor.subscribe("customusers");
    },
    action: function () {
        //TODO: not entirely sure this is the best way to handle this
        this.render('resultAdmin');
    }
});

Router.route('/userAdmin', {
    waitOn: function () {
        return Meteor.subscribe("customusers");
    },
    action: function () {
        //TODO: not entirely sure this is the best way to handle this
        if (getCurrentUser()) {
            var groupLength = getCurrentUser().adminGroups.length;
            //TODO: should not be hardcoded to EURO2016
            Session.set('selectedCompetition', 'EURO2016');
            Session.set('selectedGroup', getCurrentUser().adminGroups[groupLength - 1]);
            this.render('userAdmin');
        }
    }
});
