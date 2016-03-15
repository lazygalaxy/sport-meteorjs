Template.registerHelper('getCurrentUser', function () {
    var user = CustomUsers.findOne({
        _id: Meteor.userId()
    });
    console.log(user);
    return user;
});
