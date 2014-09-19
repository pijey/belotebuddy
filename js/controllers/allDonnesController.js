App.AllDonnesController = Ember.ArrayController.extend({
	actions:{
		deleteDonne: function(id){
			this.store.find('donne', id).then(function (donne) {
			  donne.destroyRecord(); 
			});
		}
	}
});