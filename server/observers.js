Meteor.startup(function () {
    Meteor.users.find({}).observeChanges({
        added: function (id, doc) {
            //TODO: find a better way to add users to groups
            var groups = Groups.find({});
            groups.forEach(function (group) {
                var found = (group._id == 'GLOBAL');
                group.domains.forEach(function (domain) {
                    doc.emails.forEach(function (email) {
                        if (email.address.endsWith(domain)) {
                            found = true;
                        }
                    });
                });
                if (found) {
                    UserInfo.upsert({
                        _id: id,
                    }, {
                        $addToSet: {
                            groups: group._id
                        }
                    });
                }
            });
        }
    });
});
