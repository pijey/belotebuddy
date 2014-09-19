App.PartiesRoute = Ember.Route.extend({
	model: function() {
		return this.store.find('partie');
	}
});