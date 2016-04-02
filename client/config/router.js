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

Router.route('/points', function () {
    this.render('points');
});

Router.route('/standings', {
    waitOn: function () {
        return [Meteor.subscribe("customusers")];
    },
    action: function () {
        setCompetition(false);
        setGroup(false);
        this.render('standings');
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
        setCompetition(false);
        setGroup(true);
        this.render('userAdmin');
    }
});

var setCompetition = function (checkAdmin) {
    //ensure that a competition is set
    if (!Session.get('selectedCompetition')) {
        //TODO: should not be hardcoded to EURO2016
        Session.set('selectedCompetition', 'EURO2016');
    }

    //if it is required ensure it is an admin group
    if (checkAdmin && getCurrentUser().adminCompetitions.indexOf(Session.get('selectedCompetition')) == -1) {
        var competitionLength = getCurrentUser().adminCompetitions.length;
        Session.set('selectedCompetition', getCurrentUser().adminCompetitions[0]);
    }
}

var setGroup = function (checkAdmin) {
    //ensure that a group is set
    if (!Session.get('selectedGroup')) {
        var groupLength = getCurrentUser().groups.length;
        Session.set('selectedGroup', getCurrentUser().groups[groupLength - 1]);
    }

    //if it is required ensure it is an admin group
    if (checkAdmin && getCurrentUser().adminGroups.indexOf(Session.get('selectedGroup')) == -1) {
        var groupLength = getCurrentUser().adminGroups.length;
        Session.set('selectedGroup', getCurrentUser().adminGroups[groupLength - 1]);
    }
}
