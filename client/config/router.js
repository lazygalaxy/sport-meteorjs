Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'
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
            Session.set('selectedGroup', getCurrentUser().groupAdmin[0]);
            this.render('userAdmin');
        }
    }
});

Router.route('/', function () {
    Router.go('predictions');
});
