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

Router.route('/', function () {
    Router.go('predictions');
});
