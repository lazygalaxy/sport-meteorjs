Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});

//TODO: try to generalize using onBeforeAction
//Router.onBeforeAction(function () {
//    if (!Meteor.userId()) {
//        Router.configure({
//            layoutTemplate: 'blankLayout'
//        });
//        //Router.current().route.getName();
//        this.render('login');
//    } else {
//        Router.configure({
//            layoutTemplate: 'mainLayout',
//            notFoundTemplate: 'notFound',
//            //loadingTemplate: 'loading'
//        });
//        this.next();
//    }
//});

Router.route('/login', function () {
    if (!Meteor.userId()) {
        this.render('login');
    } else {
        Router.go('home');
    }
});

Router.route('/register', function () {
    if (!Meteor.userId()) {
        this.render('register');
    } else {
        Router.go('home');
    }
});

Router.route('/passwordRecovery', function () {
    if (!Meteor.userId()) {
        this.render('passwordRecovery');
    } else {
        Router.go('home');
    }
});

//TODO: remove this once loading looks good
Router.route('/loading', function () {
    this.render('loading');
});

Router.route('/predictions', function () {
    if (Meteor.userId()) {
        this.render('predictions');
    } else {
        Router.go('login');
    }
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

Router.route('/home', function () {
    Router.go('predictions');
});
