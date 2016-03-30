Router.onBeforeAction(function () {
    if (!Meteor.userId()) {
        Router.configure({
            layoutTemplate: 'blankLayout'
        });
        this.render(Router.current().route.getName());
    } else {
        Router.configure({
            layoutTemplate: 'mainLayout',
            notFoundTemplate: 'notFound',
            //loadingTemplate: 'loading'
        });
        this.next();
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

Router.route('/predictions', function () {
    this.render('predictions');
});

Router.route('/standings', {
    waitOn: function () {
        return Meteor.subscribe("customusers");
    },
    action: function () {
        //TODO: not entirely sure this is the best way to handle this
        if (getCurrentUser()) {
            Session.set('selectedGroup', getCurrentUser().groups[0]);
            Session.set('selectedCompetition', "EURO2016TEST");
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
            Session.set('selectedCompetition', "EURO2016TEST");
            Session.set('selectedGroup', getCurrentUser().adminGroups[0]);
            this.render('userAdmin');
        }
    }
});

Router.route('/', function () {
    Router.go('predictions');
});
