App.AllDonnesRoute = Ember.Route.extend({
	model: function() {
		return this.store.all('donne');
	}
});