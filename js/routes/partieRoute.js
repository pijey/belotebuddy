App.PartieRoute = Ember.Route.extend({
	model: function(params) {
		return this.store.find('partie', params.partie_id);
	}
});