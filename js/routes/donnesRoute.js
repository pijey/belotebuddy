App.DonnesRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('partie', params.partie_id);
	}
});