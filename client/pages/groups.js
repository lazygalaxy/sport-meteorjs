Template.groups.events({
	"submit form": function (event) {
		event.preventDefault();

		var doc = {};
		doc['label'] = $('[id=grouplabel]').val();

		var selectedGroup = Session.get('selectedGroup');

		Meteor.call('upsertGroup', selectedGroup._id, doc, function (error, result) {
			if (error) {
				toastr.error(error.reason);
			} else if (result) {
				setSelectedGroup(true, selectedGroup._id, true);
				toastr.success(result, 'Group Saved');

			}
		});
	}
});

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

Template.groups.helpers({
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

Template.inviteUsers.helpers({
	getJoinGroupURL: function (code) {
		return Meteor.absoluteUrl('groups/' + code)
	}
});

Template.groups.rendered = function () {
	// Initialize dataTables
	$('.dataTables-adminusers').DataTable();
};

Template.userRow.rendered = function () {
	$('.my-datepicker').datepicker({
		format: "dd/mm/yyyy"
	});
}
