Template.userRow.events({
    "change": function (event) {
        inputUpsertUser(event.target.id, event.target.name, event.target.checked);
        inputUpsertUser(event.target.id, event.target.name + 'Date', new Date());
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
        console.info(emails);
        return emails;
    }
});

Template.userAdmin.rendered = function () {
    // Initialize dataTables
    $('.dataTables-adminusers').DataTable();
};
