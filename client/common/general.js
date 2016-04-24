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
