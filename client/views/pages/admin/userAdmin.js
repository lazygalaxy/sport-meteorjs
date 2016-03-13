Template.userAdmin.helpers({
    getUsers: function () {
        var users = Predictions.find({});
        return users;
        /*
        var theQuestions = questions.find({}).fetch();
        if (Meteor.user()) {
            var predictionsMap = predictions.find({
                user_id: Meteor.user()._id
            }).fetch().reduce(function (map, obj) {
                map[obj.question_id] = obj;
                return map;
            }, {});

            theQuestions.forEach(function (question) {
                if (question._id in predictionsMap) {
                    question.home_score = predictionsMap[question._id].home_score;
                    question.away_score = predictionsMap[question._id].away_score;
                }
            });
        }
        return theQuestions;
        */
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
