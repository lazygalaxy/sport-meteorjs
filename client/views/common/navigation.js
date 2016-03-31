Template.navigation.rendered = function () {
    // Initialize metisMenu
    $('#side-menu').metisMenu();
};

Template.navigation.events({
    'click .logout': function (event) {
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});
