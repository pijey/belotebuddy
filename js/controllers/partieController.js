App.PartieController = Ember.ObjectController.extend({
	actions: {
		editNomNS: function(){
			this.set('isEditingNomNS', true);
		},
		updateNomNS: function(model){
			this.model.set("nomNS", model.get("nomNS"));
			this.model.save();
			this.set('isEditingNomNS', false);
		}
	},

	isEditingNomNS: false,
});