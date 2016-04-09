inputUpsertPrediction = function (id, name, value) {
    Meteor.call('upsertPrediction', id, name, value, function (error, result) {
        if (error) {
            toastr.error(error.reason);
        } else {
            if (result) {
                toastr.success(result, 'Prediction Saved');
            }
        }
    });
}

inputUpsertResult = function (id, name, value) {
    Meteor.call('upsertResult', id, name, value, function (error, result) {
        if (error) {
            toastr.error(error.reason);
        } else {
            if (result) {
                toastr.success(result, 'Result Saved');
            }
        }
    });
}

inputUpsertUser = function (userId, name, value) {
    Meteor.call('upsertUser', userId, name, value, function (error, result) {
        if (error) {
            toastr.error(error.reason);
        } else {
            toastr.success(result);
        }
    });
}
