Template.userRow.events({
	"change .paid-checkbox": function (event) {
		event.preventDefault();
		inputUpsertUser(event.target.id, event.target.name, event.target.checked);
		var paidDate = getPaidDate(event.target.id);
		if (!paidDate || paidDate == 'N/A') {
			inputUpsertUser(event.target.id, event.target.name + "Date", moment(new Date()).format('DD/MM/YYYY'));
		}
	},
	"focusin .paid-date": function (event) {
		event.preventDefault();
		if (event.target.value != 'N/A') {
			inputUpsertUser(event.target.id, event.target.name, event.target.value);
		}
	}
});

var getGroupUsers = function () {
	return UserInfo.find({
		groups: Session.get('selectedGroup')._id
	}, {
		sort: {
			username: 1
		}
	}).fetch();
}

Template.userAdmin.helpers({
	getGroupUsers: function () {
		return getGroupUsers();
	},
	getClipboardEmails: function () {
		var emails = "";

		getGroupUsers().forEach(function (user) {
			emails += user.emails[0].address + ';';
		});
		return emails;
	}
});

Template.userAdmin.rendered = function () {
	// Initialize dataTables
	$('.dataTables-adminusers').DataTable();
};

Template.userRow.rendered = function () {
	$('.my-datepicker').datepicker({
		format: "dd/mm/yyyy"
	});
}
