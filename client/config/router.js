Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'
});

Router.route('/predictions', function () {
    this.render('predictions');
});

Router.route('/standings', function () {
    this.render('standings');
});

Router.route('/resultAdmin', function () {
    this.render('resultAdmin');
});

Router.route('/userAdmin', {
    waitOn: function () {
        return Meteor.subscribe("customusers");
    },
    action: function () {
        //TODO: not entirely sure this is the best way to handle this
        if (getCurrentUser()) {
            Session.set('selectedGroup', getCurrentUser().groupAdmin[0]);
            this.render('userAdmin');
        }
    }
});

Router.route('/', function () {
    Router.go('predictions');
});
