Template.userRow.events({
    "change .paid-checkbox": function (event) {
        inputUpsertUser(event.target.id, event.target.name, event.target.checked);
    },
    "focusin .paid-date": function (event) {
        inputUpsertUser(event.target.id, event.target.name, event.target.value);
    }
});

var getGroupUsers = function () {
    return CustomUsers.find({
        groups: Session.get('selectedGroup')._id
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
