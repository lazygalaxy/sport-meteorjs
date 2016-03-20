Template.userRow.events({
    "change": function (event) {
        inputUpsertUser(event.target.id, event.target.name, event.target.checked);
    }
});

Template.userAdmin.helpers({
    getUsers: function () {
        return CustomUsers.find({
            groups: Session.get('selectedAdminGroup')
        });
    }
});

Template.userRow.helpers({
    getPaidAttribute: function () {
        return "paid" + Session.get('selectedAdminGroup') + Session.get('selectedCompetition');
    },
    getPaidValue: function (id) {
        return CustomUsers.findOne({
            _id: id
        })["paid" + Session.get('selectedAdminGroup') + Session.get('selectedCompetition')];
    }
});

var inputUpsertUser = function (userId, name, value) {
    Meteor.call('upsertUser', userId, name, value, function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.info("update the user GUI here!!!");
        }
    });
}

Template.userAdmin.rendered = function () {
    // Initialize dataTables
    $('.dataTables-example').DataTable({
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
