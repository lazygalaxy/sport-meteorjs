Template.createGroup.events({
	'submit form': function (event) {
		event.preventDefault();
		var doc = {};
		doc['label'] = $('[id=creategrouplabel]').val();
		doc['code'] = Math.random().toString().substring(2, 12);
		doc['logo'] = 'logos/GOME.png';
		doc['domains'] = [];

		Meteor.call('upsertGroup', doc.code, doc, function (error, result) {
			if (error) {
				toastr.error(error.reason);
			} else if (result) {
				toastr.success(result, 'Group Saved');
				$('#createGroup').modal('hide');
				Router.go('/groups/' + doc.code + '?admin=t');
			}
			return true;
		});
	}
});
