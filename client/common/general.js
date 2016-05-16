prettyDate = function (date) {
	return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

titleCase = function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

Template.registerHelper('prettyDate', function (date) {
	return prettyDate(date);
});

Template.registerHelper('equals', function (a, b) {
	return a === b;
});

Template.registerHelper('gtLength0', function (array) {
	return array.length > 0;
});

Template.registerHelper('gtLength1', function (array) {
	return array.length > 1;
});

Template.registerHelper('length', function (array) {
	return array.length;
});

Template.registerHelper('exists', function (value) {
	if (value) {
		return true;
	}
	return false;
});

Template.registerHelper('predictionsActive', function () {
	if (Session.get('selectedMenu') == 'predictions') {
		return 'active';
	}
	return 'inactive';
});

Template.registerHelper('rankingsActive', function () {
	if (Session.get('selectedMenu') == 'rankings') {
		return 'active';
	}
	return 'inactive';
});

Template.registerHelper('groupsActive', function () {
	if (Session.get('selectedMenu') == 'groups') {
		return 'active';
	}
	return 'inactive';
});
