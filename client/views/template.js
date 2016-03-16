getCurrentUser = function () {
    return CustomUsers.findOne({
        _id: Meteor.userId()
    });
}

Template.registerHelper('getCurrentUser', function () {
    return getCurrentUser();
});

Template.registerHelper('prettyDate', function (date) {
    return moment(date);
});
