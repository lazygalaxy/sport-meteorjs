prettyDate = function (date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

Template.registerHelper('prettyDate', function (date) {
    return prettyDate(date);
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.registerHelper('gtLength1', function (array) {
    return array.length > 1;
});
