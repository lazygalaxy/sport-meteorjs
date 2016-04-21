Template.registerHelper('getGroups', function () {
	return getGroups();
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

getGroup = function (id) {
	return Groups.findOne({
		_id: id
	});
}

getGroups = function () {
	return Groups.find({}, {
		sort: {
			label: 1
		}
	}).fetch();
}

setSelectedGroup = function (checkAdmin, id = null) {
	var oldGroupId;
	if (Session.get('selectedGroup')) {
		oldGroupId = Session.get('selectedGroup')._id;
	}

	var newGroupId = oldGroupId;
	if (id && getGroup(id)) {
		newGroupId = id;
	}

	var currentUser = getCurrentUser();
	//chech if it is an admin group if required
	if (checkAdmin && currentUser.adminGroups.indexOf(newGroupId) == -1) {
		newGroupId = currentUser.adminGroups[0];
	}

	if (newGroupId && newGroupId != oldGroupId && getGroup(newGroupId)) {
		// if there is valid newGrouId
		Session.set('selectedGroup', getGroup(newGroupId));

	} else if (!oldGroupId || !getGroup(oldGroupId)) {
		// if there is no oldGroupId or the oldGroupId is invalid
		Session.set('selectedGroup', getGroups()[0]);
	}
}
