App.PartiesController = Ember.ArrayController.extend({
	actions:{
		deletePartie: function(id){
			this.store.find('partie', id).then(function (partie) {
			  partie.destroyRecord(); 
			});
		}
	}
});