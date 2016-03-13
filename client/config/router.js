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

Router.route('/userAdmin', function () {
    this.render('userAdmin');
});

Router.route('/', function () {
    Router.go('predictions');
});
