Template.userRow.events({
    "change": function (event) {
        inputUpsertUser(event.target.id, event.target.name, event.target.checked);
    }
});

Template.userAdmin.helpers({
    getGroupUsers: function () {
        return CustomUsers.find({
            groups: Session.get('selectedGroup')._id
        });
    }
});

var inputUpsertUser = function (userId, name, value) {
    Meteor.call('upsertUser', userId, name, value, function (error, result) {
        if (error) {
            toastr.error(error.reason, 'Error: Result Not Saved.');
        } else {
            toastr.success(result, 'Result Saved');
        }
    });
}

Template.userAdmin.rendered = function () {
    // Initialize dataTables
    $('.dataTables-users').DataTable({
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            {
                extend: 'copy'
            },
            {
                extend: 'csv'
            },
            {
                extend: 'excel',
                title: 'ExampleFile'
            },
            {
                extend: 'pdf',
                title: 'ExampleFile'
            },

            {
                extend: 'print',
                customize: function (win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]

    });

};
