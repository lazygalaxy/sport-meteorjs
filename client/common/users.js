Template.registerHelper('getUsersTotal', function () {
	return UserInfo.find({}).fetch().length;
});

getUser = function (id) {
	return UserInfo.findOne({
		_id: id
	});
}

Template.registerHelper('getUsers', function () {
	var selectedGroup = Session.get('selectedGroup');
	return UserInfo.find({
		groups: selectedGroup._id
	}, {
		sort: {
			username: 1
		}
	}).fetch();
});

getCurrentUser = function () {
	return getUser(Meteor.userId());
}

Template.registerHelper('getCurrentUser', function () {
	return getCurrentUser();
});

Template.registerHelper('getCurrentUsername', function () {
	return getCurrentUser().username;
});

Template.registerHelper('getUserAvatar', function (id) {
	return getUser(id).profile.avatar;
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

hasPaid = function (id) {
	var user = getUser(id);
	if (user && user.hasOwnProperty(getPaidAttribute())) {
		return user[getPaidAttribute()];
	} else {
		return false;
	}
}

Template.registerHelper('hasPaid', function (id) {
	return hasPaid(id);
});

Template.registerHelper('paidButtonVisible', function () {
	var user = getCurrentUser();
	return (hasPaid(user._id) || (user.hasOwnProperty('adminGroups') && (user.adminGroups.indexOf(Session.get('selectedGroup')._id) > -1)));
});

getPaidDate = function (id) {
	var user = getUser(id);
	if (user && user.hasOwnProperty(getPaidAttribute() + 'Date')) {
		return user[getPaidAttribute() + 'Date'];
	} else {
		return 'N/A';
	}
}

Template.registerHelper('getPaidDate', function (id) {
	return getPaidDate(id);
});

getPaidAttribute = function () {
	return "paid" + Session.get('selectedGroup')._id + Session.get('selectedCompetition')._id;
}

Template.registerHelper('getPaidAttribute', function () {
	return getPaidAttribute();
});
