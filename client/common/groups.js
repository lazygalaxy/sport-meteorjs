getGroup = function (id) {
    return Groups.findOne({
        _id: id
    });
}

Template.registerHelper('getGroups', function () {
    //TODO: should maybe also include groups that the user is an admin for
    return Groups.find({
        _id: {
            $in: getCurrentUser().groups
        }
    }).fetch();
});

Template.registerHelper('getSelectedGroup', function () {
    return Session.get('selectedGroup');
});

Template.registerHelper('getAdminGroups', function () {
    return Groups.find({
        _id: {
            $in: getCurrentUser().adminGroups
        }
    }).fetch();
});

Template.registerHelper('isGlobalGroup', function () {
    return Session.get('selectedGroup')._id == 'GLOBAL';
});

setSelectedGroup = function (checkAdmin, id = null) {
    var oldGroupId;
    if (Session.get('selectedGroup')) {
        oldGroupId = Session.get('selectedGroup')._id;
    }

    var newGroupId = oldGroupId;
    if (getGroup(id)) {
        newGroupId = getGroup(id)._id;
    }

    var currentUser = getCurrentUser();
    //if it is required ensure it is an admin group
    if (checkAdmin && currentUser.adminGroups.indexOf(newGroupId) == -1) {
        var groupLength = currentUser.adminGroups.length;
        newGroupId = currentUser.adminGroups[groupLength - 1];
    }

    if (!newGroupId && !oldGroupId) {
        // there is no new or old group ids, a default needs to be set
        var groupLength = currentUser.groups.length;
        Session.set('selectedGroup', getGroup(currentUser.groups[groupLength - 1]));
    } else if (newGroupId != oldGroupId) {
        Session.set('selectedGroup', getGroup(newGroupId));
    }
}
