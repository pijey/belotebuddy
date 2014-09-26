App.PartieController = Ember.ObjectController.extend({
	actions: {
		editNomNS: function(){
			this.set('isEditingNomNS', true);
		},
		editNomEO: function(){
			this.set('isEditingNomEO', true);
		},
		updateNomNS: function(){
			this.model.save();
			this.set('isEditingNomNS', false);
		},
		updateNomEO: function(){
			this.model.save();
			this.set('isEditingNomEO', false);
		}
	},

	isEditingNomNS: false,
	isEditingNomEO: false,
});