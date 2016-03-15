Template.userRow.events({
    "change": function (event) {
        console.log("change triggered");
        inputUpsertUser(event.target.id, event.target.name, event.target.checked);
    }
});

Template.userAdmin.events({
    "click .group-selection li a": function (event) {
        console.log(event.target.text);
        Session.set('selectedGroup', event.target.text);
    }
});

Template.userAdmin.helpers({
    getUsers: function (groupId) {
        var group = Groups.findOne({
            _id: groupId
        });

        //        var users = CustomUsers.find({
        //            _id: {
        //                $in: group.users
        //            }
        //        });

        return CustomUsers.find({});
    },
    getSelectedGroup: function () {
        if (~Session.get('selectedGroup')) {
            Session.set('selectedGroup', getCurrentUser().groupAdmin[0]);
        }
        return Session.get('selectedGroup');
    }
});

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

var inputUpsertUser = function (userId, name, value) {
    Meteor.call('upsertUser', userId, name, value, function (error, result) {
        if (error) {
            console.error(error);
        } else {
            console.info("update the user GUI here!!!");
        }
    });
}
