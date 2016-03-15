Template.userRow.events({
    "change": function (event) {
        inputUpsertUser(event.target.id, event.target.name, event.target.checked);
    }
});

Template.userAdmin.helpers({
    getUsers: function () {
        //        var groups = Groups.find({
        //            admins: Meteor.userId()
        //        }).fetch();
        //
        //        var users = [];
        //        groups.forEach(function (group) {
        //            var someUsers = Meteor.users.find({}).fetch();
        //        });
        var users = CustomUsers.find({});

        //        var userInfoMap = UserInfo.find().fetch().reduce(function (map, obj) {
        //            map[obj._id] = obj;
        //            return map;
        //        }, {});
        //
        //        users.forEach(function (user) {
        //            if (user._id in userInfoMap) {
        //                user.paid = userInfoMap[user._id].paid;
        //            }
        //        });
        return users;
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
