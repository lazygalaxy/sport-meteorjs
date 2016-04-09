getUser = function (id) {
    return CustomUsers.findOne({
        _id: id
    });
}

Template.registerHelper('getUsers', function () {
    return CustomUsers.find({});
});

getCurrentUser = function () {
    return getUser(Meteor.userId());
}

Template.registerHelper('getCurrentUser', function () {
    return getCurrentUser();
});

setSelectedUser = function (id = null) {
    if (id) {
        Session.set('selectedUser', getUser(id));
    }

    if (!Session.get('selectedUser')) {
        Session.set('selectedUser', getCurrentUser());
    }
}

Template.registerHelper('getSelectedUser', function () {
    return Session.get('selectedUser');
});

Template.registerHelper('hasPaid', function (id) {
    var user = getUser(id);
    if (user && user.hasOwnProperty(getPaidAttribute())) {
        return user[getPaidAttribute()];
    } else {
        return false;
    }
});

getPaidAttribute = function () {
    return "paid" + Session.get('selectedGroup')._id + Session.get('selectedCompetition')._id;
}

Template.registerHelper('getPaidAttribute', function () {
    return getPaidAttribute();
});