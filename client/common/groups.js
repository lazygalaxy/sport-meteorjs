getGroup = function (id) {
    return Groups.findOne({
        _id: id
    });
}

Template.registerHelper('getGroups', function () {
    return Groups.find({}, {
        sort: {
            label: 1
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
    }, {
        sort: {
            label: 1
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
        console.info(currentUser.groups[groupLength - 1]);
        Session.set('selectedGroup', getGroup(currentUser.groups[groupLength - 1]));
    } else if (newGroupId != oldGroupId) {
        Session.set('selectedGroup', getGroup(newGroupId));
    }
}
