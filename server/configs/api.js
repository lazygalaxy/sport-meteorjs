var Api = new Restivus({
	prettyJson: true
});

Api.addRoute('rankings/:groupId/:competitionId', {
	authRequired: false
}, {
	get: function () {
		return calculateRankings(this.urlParams.groupId, this.urlParams.competitionId);
	}
});
