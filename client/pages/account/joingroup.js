Template.joinGroup.events({
	'submit form': function (event) {
		event.preventDefault();
		var code = $('[id=groupcode]').val();
		$('#joinGroup').modal('hide');
		Router.go('/groups/' + code);
	}
});
